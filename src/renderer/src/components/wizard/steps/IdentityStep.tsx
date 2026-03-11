import { FormField, TextInput } from '../../common/FormField'

interface IdentityStepProps {
  assistantName: string
  userName: string
  soulMd: string
  onAssistantNameChange: (name: string) => void
  onUserNameChange: (name: string) => void
  onSoulMdChange: (content: string) => void
}

const SOUL_MD_TEMPLATE = `# 身份

你是一个友好、专业的 AI 助手。

# 风格

- 用简洁清晰的语言回答问题
- 在适当的时候使用中文回答
- 保持友善和耐心

# 能力

- 回答各类问题
- 协助编程和技术问题
- 帮助写作和翻译
`

export function IdentityStep({
  assistantName,
  userName,
  soulMd,
  onAssistantNameChange,
  onUserNameChange,
  onSoulMdChange
}: IdentityStepProps): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">设置身份信息</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          给你的 AI 助手取个名字，定义它的性格
        </p>
      </div>

      <div className="space-y-4">
        <FormField label="助手名称" helpKey="ui.assistantName">
          <TextInput
            value={assistantName}
            onChange={onAssistantNameChange}
            placeholder="小明、助手、Bot..."
          />
        </FormField>

        <FormField label="你的名字" helpKey="identity.user">
          <TextInput
            value={userName}
            onChange={onUserNameChange}
            placeholder="你的显示名称"
          />
        </FormField>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">SOUL.md（AI 性格定义）</label>
            {!soulMd && (
              <button
                onClick={() => onSoulMdChange(SOUL_MD_TEMPLATE)}
                className="text-[11px] text-primary hover:text-primary/80 transition-colors"
              >
                使用默认模板
              </button>
            )}
          </div>
          <textarea
            value={soulMd}
            onChange={(e) => onSoulMdChange(e.target.value)}
            placeholder="在这里定义你的 AI 助手的性格和行为规范..."
            rows={8}
            className="w-full rounded-md border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
        </div>
      </div>
    </div>
  )
}
