export function PlanCreateButton({ handleCreate, children, className }) {
  return (
    <button type="button" onClick={handleCreate} className={className}>
      {children}
    </button>
  );
}