import { FormField, TextInput, SelectInput } from '../../common/FormField'
import { TestConnectionButton } from '../../common/TestConnectionButton'

interface ChannelStepProps {
  channelType: string
  token: string
  onChannelTypeChange: (type: string) => void
  onTokenChange: (token: string) => void
}

const CHANNEL_OPTIONS = [
  { value: 'telegram', label: 'Telegram', tokenLabel: 'Bot Token', placeholder: '从 @BotFather 获取' },
  { value: 'discord', label: 'Discord', tokenLabel: 'Bot Token', placeholder: '从开发者门户获取' },
  { value: 'slack', label: 'Slack', tokenLabel: 'Bot Token', placeholder: 'xoxb-...' },
  { value: 'whatsapp', label: 'WhatsApp', tokenLabel: 'Token', placeholder: '从 Meta 开发者获取' },
  { value: 'matrix', label: 'Matrix', tokenLabel: 'Access Token', placeholder: 'syt_...' }
]

export function ChannelStep({
  channelType,
  token,
  onChannelTypeChange,
  onTokenChange
}: ChannelStepProps): JSX.Element {
  const channelInfo = CHANNEL_OPTIONS.find((c) => c.value === channelType) || CHANNEL_OPTIONS[0]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">配置消息渠道</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          选择聊天平台并填入机器人令牌
        </p>
      </div>

      <div className="space-y-4">
        <FormField label="聊天平台">
          <SelectInput
            value={channelType}
            onChange={onChannelTypeChange}
            options={CHANNEL_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
          />
        </FormField>

        <FormField label={channelInfo.tokenLabel} helpKey="channels.botToken">
          <TextInput
            value={token}
            onChange={onTokenChange}
            placeholder={channelInfo.placeholder}
            type="password"
          />
        </FormField>

        {token && (
          <TestConnectionButton
            type={channelType}
            config={channelType === 'telegram' ? { botToken: token } : { token }}
          />
        )}

        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {channelType === 'telegram' && '在 Telegram 中搜索 @BotFather，发送 /newbot 创建机器人并获取 Token。'}
            {channelType === 'discord' && '访问 discord.com/developers，创建应用 → Bot → 复制 Token。记得开启 Message Content Intent。'}
            {channelType === 'slack' && '访问 api.slack.com/apps，创建应用 → OAuth → 安装到工作区 → 复制 Bot Token。'}
            {channelType === 'whatsapp' && '访问 developers.facebook.com，创建 WhatsApp Business 应用并获取 Token。'}
            {channelType === 'matrix' && '从 Matrix 客户端的设置中获取 Access Token。'}
          </p>
        </div>
      </div>
    </div>
  )
}
