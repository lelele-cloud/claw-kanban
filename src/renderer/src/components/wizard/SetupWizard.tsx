import { useState, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConfigStore } from '@/stores/configStore'
import { useUiStore } from '@/stores/uiStore'
import type { ConfigTemplate } from '@/lib/templates'
import { WelcomeStep } from './steps/WelcomeStep'
import { ProviderStep } from './steps/ProviderStep'
import { ChannelStep } from './steps/ChannelStep'
import { IdentityStep } from './steps/IdentityStep'
import { ReviewStep } from './steps/ReviewStep'

type WizardStep = 'welcome' | 'provider' | 'channel' | 'identity' | 'review'

const ALL_STEPS: WizardStep[] = ['welcome', 'provider', 'channel', 'identity', 'review']

const STEP_LABELS: Record<WizardStep, string> = {
  welcome: '选择模板',
  provider: 'AI 提供商',
  channel: '消息渠道',
  identity: '身份设置',
  review: '确认保存'
}

export function SetupWizard(): JSX.Element {
  const { wizardOpen, hideWizard } = useUiStore()
  const { saveSoulMd } = useConfigStore()

  // Wizard state
  const [step, setStep] = useState<WizardStep>('welcome')
  const [selectedTemplate, setSelectedTemplate] = useState<ConfigTemplate | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [provider, setProvider] = useState('anthropic')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('https://api.anthropic.com')
  const [channelType, setChannelType] = useState('telegram')
  const [token, setToken] = useState('')
  const [assistantName, setAssistantName] = useState('')
  const [userName, setUserName] = useState('')
  const [soulMd, setSoulMd] = useState('')

  // Compute active steps based on selected template
  const activeSteps = ALL_STEPS.filter((s) => {
    if (s === 'welcome' || s === 'review') return true
    if (s === 'channel' && selectedTemplate && !selectedTemplate.requiredSteps.includes('channel')) return false
    return true
  })

  const currentStepIdx = activeSteps.indexOf(step)

  const handleSelectTemplate = (template: ConfigTemplate): void => {
    setSelectedTemplate(template)
    if (template.channelType) {
      setChannelType(template.channelType)
    }
    if (template.id === 'local-assistant') {
      setProvider('ollama')
      setBaseUrl('http://localhost:11434')
    }
  }

  const goNext = (): void => {
    const nextIdx = currentStepIdx + 1
    if (nextIdx < activeSteps.length) {
      setStep(activeSteps[nextIdx])
    }
  }

  const goBack = (): void => {
    const prevIdx = currentStepIdx - 1
    if (prevIdx >= 0) {
      setStep(activeSteps[prevIdx])
    }
  }

  const canGoNext = (): boolean => {
    switch (step) {
      case 'welcome':
        return !!selectedTemplate
      case 'provider':
        return provider === 'ollama' || apiKey.length > 0
      case 'channel':
        return token.length > 0
      case 'identity':
        return true
      default:
        return false
    }
  }

  const handleSave = useCallback(async () => {
    if (!selectedTemplate) return
    setSaving(true)

    try {
      // Start with template config
      const config = { ...selectedTemplate.config }

      // Merge provider config
      const providerConfig = {
        baseUrl,
        apiType: provider,
        ...(provider !== 'ollama' && apiKey ? { apiKey } : {})
      }
      config.models = {
        providers: {
          ...config.models?.providers,
          [provider]: providerConfig
        }
      }

      // Merge channel token
      if (selectedTemplate.requiredSteps.includes('channel') && token) {
        const channels = { ...(config.channels || {}) }
        const channelConfig = { ...(channels[channelType] || {}) }
        if (channelType === 'telegram') {
          channelConfig.botToken = token
        } else {
          channelConfig.token = token
        }
        channels[channelType] = channelConfig
        config.channels = channels
      }

      // Merge identity
      if (assistantName) {
        config.ui = { ...config.ui, assistantName }
      }
      if (userName) {
        config.identity = { user: userName }
      }

      // Write config
      await window.api.config.write(config as Record<string, unknown>)

      // Write SOUL.md if provided
      if (soulMd) {
        await saveSoulMd(soulMd)
      }

      // Mark wizard as completed
      localStorage.setItem('wizard-dismissed', 'true')

      hideWizard()
    } catch (err) {
      console.error('Failed to save config:', err)
    } finally {
      setSaving(false)
    }
  }, [selectedTemplate, provider, apiKey, baseUrl, channelType, token, assistantName, userName, soulMd, hideWizard, saveSoulMd])

  const handleDismiss = (): void => {
    localStorage.setItem('wizard-dismissed', 'true')
    hideWizard()
  }

  return (
    <Dialog.Root open={wizardOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
          <div className="rounded-xl border bg-background shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">设置向导</span>
              </div>
              <Dialog.Close asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-1 px-5 pt-4">
              {activeSteps.map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      i <= currentStepIdx ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="px-5 pt-1 pb-2">
              <span className="text-[10px] text-muted-foreground">
                步骤 {currentStepIdx + 1}/{activeSteps.length} · {STEP_LABELS[step]}
              </span>
            </div>

            {/* Content */}
            <div className="px-5 py-4 min-h-[350px] max-h-[60vh] overflow-y-auto">
              {step === 'welcome' && (
                <WelcomeStep
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                />
              )}
              {step === 'provider' && (
                <ProviderStep
                  provider={provider}
                  apiKey={apiKey}
                  baseUrl={baseUrl}
                  onProviderChange={setProvider}
                  onApiKeyChange={setApiKey}
                  onBaseUrlChange={setBaseUrl}
                />
              )}
              {step === 'channel' && (
                <ChannelStep
                  channelType={channelType}
                  token={token}
                  onChannelTypeChange={setChannelType}
                  onTokenChange={setToken}
                />
              )}
              {step === 'identity' && (
                <IdentityStep
                  assistantName={assistantName}
                  userName={userName}
                  soulMd={soulMd}
                  onAssistantNameChange={setAssistantName}
                  onUserNameChange={setUserName}
                  onSoulMdChange={setSoulMd}
                />
              )}
              {step === 'review' && (
                <ReviewStep
                  template={selectedTemplate}
                  provider={provider}
                  channelType={channelType}
                  assistantName={assistantName}
                  userName={userName}
                  hasSoulMd={soulMd.length > 0}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-5 py-3">
              <button
                onClick={step === 'welcome' ? handleDismiss : goBack}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {step === 'welcome' ? (
                  '跳过向导'
                ) : (
                  <>
                    <ChevronLeft className="h-3 w-3" />
                    上一步
                  </>
                )}
              </button>

              {step === 'review' ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? '保存中...' : '保存并完成'}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  下一步
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
