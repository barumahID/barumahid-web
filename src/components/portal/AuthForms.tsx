"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { requestReset, signIn, signUp, updatePassword, type FormState } from "@/app/portal/actions";
import { CATEGORY_LABEL, type MitraCategory } from "@/lib/portal";

// Form masuk, daftar akun mitra, lupa kata sandi, dan kata sandi baru di Portal barumahID.

const input =
  "mt-1.5 w-full rounded-lg border border-brand-dark/15 bg-white px-3.5 py-2.5 text-[14px] text-brand-dark outline-none transition-colors placeholder:text-brand-mute focus:border-brand-dark";
const label = "block text-[13px] font-semibold text-brand-dark";

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand-dark px-4 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-red disabled:opacity-60"
    >
      {pending ? "Memproses..." : children}
    </button>
  );
}

function Notice({ state }: { state: FormState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-lg bg-brand-red/10 px-3.5 py-2.5 text-[13px] font-medium text-brand-red">
        {state.error}
      </p>
    );
  if (state.message)
    return <p className="rounded-lg bg-[#2D7A4F]/10 px-3.5 py-2.5 text-[13px] font-medium text-[#2D7A4F]">{state.message}</p>;
  return null;
}

export function LoginForm() {
  const [state, action] = useActionState(signIn, {});
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={input} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={label}>Kata sandi</label>
          <Link href="/portal/lupa" className="text-[12.5px] font-semibold text-brand-gray hover:text-brand-red">Lupa kata sandi?</Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      <Submit>Masuk</Submit>
    </form>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signUp, {});
  if (state.ok) return <Notice state={state} />;
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      <div>
        <label htmlFor="full_name" className={label}>Nama lengkap</label>
        <input id="full_name" name="full_name" autoComplete="name" required className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={input} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>No. WhatsApp aktif</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" required className={input} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={label}>Jenis kemitraan</label>
          <select id="category" name="category" required defaultValue="" className={input}>
            <option value="" disabled>Pilih</option>
            {(Object.keys(CATEGORY_LABEL) as MitraCategory[]).map((c) => (
              <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="company" className={label}>
            Nama usaha <span className="font-normal text-brand-mute">(opsional)</span>
          </label>
          <input id="company" name="company" autoComplete="organization" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="password" className={label}>Kata sandi</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={input} />
        <p className="mt-1 text-[12px] text-brand-mute">Minimal 8 karakter.</p>
      </div>
      <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-brand-gray">
        <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 accent-[#C53B3B]" />
        <span>
          Saya menyetujui pengolahan data sesuai{" "}
          <Link href="/kebijakan-privasi" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark underline underline-offset-2">
            kebijakan privasi
          </Link>{" "}
          barumahID.
        </span>
      </label>
      <Submit>Buat akun mitra</Submit>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action] = useActionState(requestReset, {});
  if (state.ok) return <Notice state={state} />;
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      <div>
        <label htmlFor="email" className={label}>Email akun</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={input} />
      </div>
      <Submit>Kirim tautan</Submit>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState(updatePassword, {});
  return (
    <form action={action} className="space-y-4">
      <Notice state={state} />
      <div>
        <label htmlFor="password" className={label}>Kata sandi baru</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={input} />
      </div>
      <div>
        <label htmlFor="confirm" className={label}>Ulangi kata sandi baru</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={input} />
      </div>
      <Submit>Simpan kata sandi</Submit>
    </form>
  );
}
