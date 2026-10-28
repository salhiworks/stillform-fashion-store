import { Link } from "react-router";
import { Wordmark } from "@/components/Wordmark";

/** Shown at /admin while the store runs in demo mode. */
export default function SetupPage() {
  const steps = [
    ["Create a Supabase project", "Free tier is enough. Note the project URL and the anon (publishable) key under Project Settings → API."],
    ["Set up the database", "Open the SQL editor, paste supabase/setup.sql and run it. It creates the tables, security rules, storage bucket and the demo collection."],
    ["Add your keys", "Copy .env.example to .env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Restart npm run dev."],
    ["Create your account", "In Authentication → Users, add a user with your email and a password. Turn off public sign-ups."],
    ["Make yourself an administrator", "Run the one-line SQL from docs/SETUP.md with your email. Then sign in here."],
  ];
  return (
    <div className="min-h-svh bg-plaster px-6 py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <Wordmark name="STILLFORM" className="text-[13px]" />
        <div className="flex flex-col gap-3">
          <p className="label text-muted-foreground">Studio</p>
          <h1 className="type-wide text-[clamp(2rem,4vw,3rem)] font-extralight leading-tight">Connect your store to open the dashboard.</h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            The storefront is running on its demo collection. The dashboard needs a Supabase project to save products, photos and orders. It takes about ten minutes.
          </p>
        </div>
        <ol className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
          {steps.map(([title, body], i) => (
            <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-2 py-5">
              <span className="tabular text-[13px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[15px] font-medium">{title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-[14px] text-muted-foreground">
          Full instructions: <code className="text-ink">docs/SETUP.md</code>. <Link to="/" className="underline underline-offset-2">Back to the store</Link>
        </p>
      </div>
    </div>
  );
}
