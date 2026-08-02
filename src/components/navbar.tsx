"use client";

import Link from "next/link";
import { Show, useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import { SquareArrowRightExit } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  return (
    <nav
      style={{
        borderBottom: "1px solid #e5e7eb",
        width: "100%",
        background: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          Card Chaser
        </Link>

        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <Dropdown
            label="Browse"
            isSignedIn={isSignedIn}
            items={[
              { label: "Browse All", href: "/browse" },
              { divider: true },
              { section: "Popular Filters" },
              { label: "Browse Pokémon", href: "/browse?tcg=pokemon" },
              { label: "Browse One Piece", href: "/browse?tcg=one-piece" },
            ]}
          />

          <Dropdown
            label="Collection"
            isSignedIn={isSignedIn}
            items={[
              {
                label: "My Collection",
                href: "/collection",
                protected: true,
                tooltip: "Sign in to manage your collection",
              },
              {
                label: "My Wishlist",
                href: "/wishlist",
                protected: true,
                tooltip: "Sign in to save cards to your wishlist",
              },
              {
                label: "My Chase Requests",
                href: "/requests",
                protected: true,
                tooltip: "Sign in to create and manage chase requests",
              },
            ]}
          />

          <Dropdown
            label="Marketplace"
            isSignedIn={isSignedIn}
            items={[
              { label: "Browse Chase Requests", href: "/marketplace" },
              {
                label: "My Offers",
                href: "/offers",
                protected: true,
                tooltip: "Sign in to view your offers",
              },
            ]}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Show when="signed-out">
            <Link href="/sign-in">Sign In</Link>

            <Link href="/sign-up">Sign Up</Link>
          </Show>

          <Show when="signed-in">
            <ProfileDropdown />
          </Show>
        </div>
      </div>
    </nav>
  );
}

function Dropdown({
  label,
  isSignedIn,
  items,
}: {
  label: string;
  isSignedIn?: boolean;
  items: (
    | {
        label: string;
        href: string;
        protected?: boolean;
        tooltip?: string;
      }
    | {
        section: string;
      }
    | {
        divider: true;
      }
  )[];
}) {
  return (
    <div
      className="group"
      style={{
        position: "relative",
      }}
    >
      <button
        className="hover:text-blue-600 focus:outline-none transition-colors"
        style={{
          background: "none",
          border: "none",
          fontSize: "16px",
          fontWeight: 500,
          padding: "8px",
        }}
        disabled
      >
        {label} ▾
      </button>

      <div
        className="
          invisible
          group-hover:visible
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-150
        "
        style={{
          position: "absolute",
          top: "42px",
          left: 0,
          width: "220px",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "8px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          zIndex: 100,
        }}
      >
        {items.map((item, index) =>
          "divider" in item ? (
            <div
              key={index}
              style={{
                borderTop: "1px solid #e5e7eb",
                margin: "8px 0",
              }}
            />
          ) : "section" in item ? (
            <div
              key={index}
              style={{
                padding: "8px 12px 6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
              }}
            >
              {item.section}
            </div>
          ) : (
            <ProtectedLink
              key={item.href}
              href={item.href}
              disabled={item.protected && !isSignedIn}
              tooltip={item.tooltip}
            >
              {item.label}
            </ProtectedLink>
          ),
        )}
      </div>
    </div>
  );
}

function ProfileDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "relative",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="hover:bg-gray-100 transition-colors"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "8px",
        }}
      >
        {user?.imageUrl && (
          <Image
            src={user.imageUrl}
            alt="Profile"
            width={32}
            height={32}
            style={{
              borderRadius: "50%",
            }}
          />
        )}

        <span
          style={{
            fontWeight: 500,
          }}
        >
          {user?.username ?? "Account"}
        </span>

        <span>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "44px",
            width: "220px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            zIndex: 100,
          }}
        >
          <ProfileLink href="/profile/">My Profile</ProfileLink>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              margin: "8px 0",
            }}
          />

          <button
            className="hover:bg-gray-100 transition-colors"
            onClick={() => signOut()}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "none",
              background: "none",
              textAlign: "left",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            Sign Out <SquareArrowRightExit size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        block
        hover:bg-gray-100
        transition-colors
      "
      style={{
        padding: "10px 12px",
        borderRadius: "6px",
        fontSize: "14px",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {children}
    </Link>
  );
}

function ProtectedLink({
  href,
  children,
  disabled,
  tooltip,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
}) {
  if (disabled) {
    return (
      <div
        className="group relative"
        style={{
          padding: "10px 12px",
          borderRadius: "6px",
          color: "#9ca3af",
          cursor: "not-allowed",
          fontSize: "14px",
        }}
      >
        {children}

        {tooltip && (
          <div
            className="
              invisible
              group-hover:visible
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-100
            "
            style={{
              position: "absolute",
              left: "100%",
              top: "50%",
              transform: "translateY(-50%)",
              marginLeft: "8px",
              background: "#111827",
              color: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              zIndex: 200,
              pointerEvents: "none",
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block hover:bg-gray-100 transition-colors"
      style={{
        padding: "10px 12px",
        borderRadius: "6px",
        textDecoration: "none",
        color: "inherit",
        fontSize: "14px",
      }}
    >
      {children}
    </Link>
  );
}
