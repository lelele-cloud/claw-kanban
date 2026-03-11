import { useState } from 'react'
import { FormField, TextInput, SelectInput } from '../../common/FormField'
import { TestConnectionButton } from '../../common/TestConnectionButton'

interface ProviderStepProps {
  provider: string
  apiKey: string
  baseUrl: string
  onProviderChange: (provider: string) => void
  onApiKeyChange: (apiKey: string) => void
  onBaseUrlChange: (baseUrl: string) => void
}

const PROVIDERS = [
  { value: 'anthropic', label: 'Anthropic (Claude)', baseUrl: 'https://api.anthropic.com' },
  { value: 'openai', label: 'OpenAI (GPT)', baseUrl: 'https://api.openai.com/v1' },
  { value: 'google', label: 'Google (Gemini)', baseUrl: 'https://generativelanguage.googleapis.com' },
  { value: 'ollama', label: 'Ollama (本地模型)', baseUrl: 'http://localhost:11434' },
  { value: 'deepseek', label: 'DeepSeek', baseUrl: 'https://api.deepseek.com' },
  { value: 'mistral', label: 'Mistral', baseUrl: 'https://api.mistral.ai' }
]

export function ProviderStep({
  provider,
  apiKey,
  baseUrl,
  onProviderChange,
  onApiKeyChange,
  onBaseUrlChange
}: ProviderStepProps): JSX.Element {
  const [showBaseUrl, setShowBaseUrl] = useState(false)
  const needsApiKey = provider !== 'ollama'
  const providerInfo = PROVIDERS.find((p) => p.value === provider)

  const handleProviderChange = (value: string): void => {
    onProviderChange(value)
    const info = PROVIDERS.find((p) => p.value === value)
    if (info) {
      onBaseUrlChange(info.baseUrl)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">配置 AI 提供商</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          选择你的 AI 模型提供商并填入 API 密钥
        </p>
      </div>

      <div className="space-y-4">
        <FormField label="AI 提供商" helpKey="models.providers.apiType">
          <SelectInput
            value={provider}
            onChange={handleProviderChange}
            options={PROVIDERS.map((p) => ({ value: p.value, label: p.label }))}
          />
        </FormField>

        {needsApiKey && (
          <FormField label="API 密钥" helpKey="models.providers.apiKey">
            <TextInput
              value={apiKey}
              onChange={onApiKeyChange}
              placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
              type="password"
            />
          </FormField>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBaseUrl(!showBaseUrl)}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {showBaseUrl ? '隐藏高级选项' : '显示高级选项'}
          </button>
        </div>

        {showBaseUrl && (
          <FormField label="API 地址" helpKey="models.providers.baseUrl">
            <TextInput
              value={baseUrl}
              onChange={onBaseUrlChange}
              placeholder={providerInfo?.baseUrl || 'https://api.example.com'}
            />
          </FormField>
        )}

        <TestConnectionButton
          type={provider}
          config={{ apiKey, baseUrl }}
        />
      </div>
    </div>
  )
}
