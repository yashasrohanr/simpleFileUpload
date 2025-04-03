export default function Navbar({ onSearch }) {
  return (
    <nav className="navbar navbar-expand-lg bg-primary bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a className="navbar-brand">Simplified DropBox</a>

        <form className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search.."
            onChange={(e) => onSearch(e.target.value)}
          />
        </form>
      </div>
    </nav>
  );
}
