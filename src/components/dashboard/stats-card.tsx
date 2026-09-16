import { Card, CardContent } from "../ui/card";

interface StatCardProps {
  title: string;
  value: number | undefined;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color?: string;
  textColor?: string;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color = "bg-green-500",
  textColor = "text-white",
  bgColor = "",
}) => {
  return (
    <Card
      className={`${bgColor} border-0 ${textColor} overflow-hidden relative`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p className={`text-sm font-medium`}>{title}</p>
              <h3 className="text-5xl font-bold">{value}</h3>
            </div>
            <span className="text-sm font-light">{description}</span>
          </div>

          <div className={`p-3 rounded-lg ${color} ${bgColor}/70`}>
            <Icon size={28} strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
