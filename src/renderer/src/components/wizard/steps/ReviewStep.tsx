import { CheckCircle2 } from 'lucide-react'
import type { ConfigTemplate } from '@/lib/templates'

interface ReviewStepProps {
  template: ConfigTemplate | null
  provider: string
  channelType: string
  assistantName: string
  userName: string
  hasSoulMd: boolean
}

interface ReviewItemProps {
  label: string
  value: string
  done: boolean
}

function ReviewItem({ label, value, done }: ReviewItemProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <CheckCircle2
        className={`h-4 w-4 shrink-0 ${done ? 'text-green-500' : 'text-muted-foreground'}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground truncate">{value}</p>
      </div>
    </div>
  )
}

const PROVIDER_NAMES: Record<string, string> = {
  anthropic: 'Anthropic (Claude)',
  openai: 'OpenAI (GPT)',
  google: 'Google (Gemini)',
  ollama: 'Ollama (本地)',
  deepseek: 'DeepSeek',
  mistral: 'Mistral'
}

export function ReviewStep({
  template,
  provider,
  channelType,
  assistantName,
  userName,
  hasSoulMd
}: ReviewStepProps): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">确认配置</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          检查以下配置是否正确，然后点击保存
        </p>
      </div>

      <div className="space-y-2">
        <ReviewItem
          label="配置模板"
          value={template?.name || '自定义'}
          done={!!template}
        />
        <ReviewItem
          label="AI 提供商"
          value={PROVIDER_NAMES[provider] || provider}
          done={!!provider}
        />
        {template?.requiredSteps.includes('channel') && (
          <ReviewItem
            label="消息渠道"
            value={channelType.charAt(0).toUpperCase() + channelType.slice(1)}
            done={!!channelType}
          />
        )}
        <ReviewItem
          label="助手名称"
          value={assistantName || '未设置'}
          done={!!assistantName}
        />
        <ReviewItem
          label="用户名"
          value={userName || '未设置'}
          done={!!userName}
        />
        <ReviewItem
          label="SOUL.md"
          value={hasSoulMd ? '已配置' : '未配置（可稍后设置）'}
          done={hasSoulMd}
        />
      </div>

      <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-3">
        <p className="text-xs text-green-700 dark:text-green-400">
          点击「保存并完成」后，配置将写入 ~/.openclaw/openclaw.json。你可以随时在面板中修改任何设置。
        </p>
      </div>
    </div>
  )
}
