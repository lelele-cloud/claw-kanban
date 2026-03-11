import { cn } from '@/lib/utils'
import { templates, type ConfigTemplate } from '@/lib/templates'

interface WelcomeStepProps {
  selectedTemplate: ConfigTemplate | null
  onSelectTemplate: (template: ConfigTemplate) => void
}

export function WelcomeStep({ selectedTemplate, onSelectTemplate }: WelcomeStepProps): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">欢迎使用 OpenClaw</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          选择一个模板快速开始配置，或稍后自行定制
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => {
          const Icon = template.icon
          const isSelected = selectedTemplate?.id === template.id
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-4 text-left transition-all hover:border-primary/50',
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium">{template.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{template.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
