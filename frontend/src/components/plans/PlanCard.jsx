import { Link } from "react-router-dom";

export const PlanCard = ({ plan, onDelete }) => {
  return (
    <div className="plan-card">
      <div className="plan-info">
        <h3 className="plan-title">{plan.title}</h3>
        <p className="plan-dates">
          {plan.start_date} 〜 {plan.end_date}
        </p>
      </div>
      <div className="plan-actions">
        <Link to={`/trip-plan/${plan.id}`}>
          <button className="btn btn-primary">編集</button>
        </Link>
        <button 
          className="btn btn-danger"
          onClick={() => onDelete(plan.id)}
        >
          削除
        </button>
      </div>
    </div>
  );
};
