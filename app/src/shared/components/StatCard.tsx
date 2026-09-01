interface StatCardProps {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export const StatCard = ({ label, value, suffix, icon }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>
          {value}
          {suffix}
        </strong>
      </div>
    </div>
  );
};
