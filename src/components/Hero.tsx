import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

type HeroProps = {
  user: User;
  logo: string;
  average: number;
  tirednessLabel: string;
  onManageFactors: () => void;
};

export function Hero({
  user,
  logo,
  average,
  tirednessLabel,
  onManageFactors,
}: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <header className="hero">
      <div className="hero-top">
        <div className="logo-row">
          <img src={logo} alt="Moemeter" className="logo" />

          <div>
            <h1>Moemeter</h1>
            <p className="subtitle">Your energy journal</p>
          </div>
        </div>

        <div className="user-menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className="avatar-button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? "User"}
                className="user-avatar"
              />
            ) : (
              <span>👤</span>
            )}
          </button>

          {menuOpen && (
            <div className="user-menu">
              <strong>{user.displayName}</strong>
              <small>{user.email}</small>

              <hr />

              <button
                type="button"
                className="menu-item"
                onClick={onManageFactors}
                >
                🏷️ Manage factors
                </button>

              <button
                type="button"
                className="menu-item danger"
                onClick={handleLogout}
              >
                🚪 Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hero-score">
        <span>{tirednessLabel}</span>
        <strong>{average.toFixed(1)} / 10</strong>
      </div>
    </header>
  );
}