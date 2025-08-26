export function PlanCreateButton({ handleCreate, children }) {
  return (
    <button type="button" onClick={handleCreate}>
      {children}
    </button>
  );
}