"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitInquiry } from "@/app/[locale]/inquiry/actions";
import { Link } from "@/i18n/navigation";
import { COUNTERPARTY_TYPES, SERVICES, type InquiryField, type InquiryState } from "@/lib/inquiry/schema";
import { INQUIRIES_EMAIL } from "@/lib/site";

const INITIAL_STATE: InquiryState = { status: "idle" };

function Field({
  name,
  label,
  optionalLabel,
  error,
  children,
}: {
  name: InquiryField;
  label: string;
  optionalLabel?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="block text-[14px] font-medium text-navy mb-1.5">
        {label}
        {optionalLabel && <span className="font-normal text-slate"> ({optionalLabel})</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[14px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function Form({ onReset }: { onReset: () => void }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitInquiry, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      statusRef.current?.focus();
    } else if (state.status === "error") {
      const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (invalid ?? statusRef.current)?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-gold/50 bg-mist p-8 outline-none">
        <h2 className="text-[28px] leading-tight text-navy">{t("success.title")}</h2>
        <p className="mt-3 text-slate">{t("success.body")}</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 text-[13px] uppercase tracking-[.12em] text-navy border-b border-gold pb-1"
        >
          {t("success.again")}
        </button>
      </div>
    );
  }

  const failed = state.status === "error" ? state : undefined;
  const value = (name: InquiryField) => failed?.values[name] ?? "";
  const fieldProps = (name: InquiryField) => {
    const code = failed?.fieldErrors[name];
    return {
      id: name,
      name,
      defaultValue: value(name),
      "aria-invalid": code ? true : undefined,
      "aria-describedby": code ? `${name}-error` : undefined,
    };
  };
  const errorFor = (name: InquiryField) => {
    const code = failed?.fieldErrors[name];
    return code ? t(`errors.${code}`) : undefined;
  };

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-6">
      <div>
        <h2 className="text-[28px] leading-tight text-navy">{t("title")}</h2>
        <p className="mt-1 text-[14px] text-slate">{t("requiredNote")}</p>
      </div>

      {failed && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="border-l-2 border-error pl-4 text-[15px] text-error outline-none">
          {failed.code === "validation" ? t("errors.summary") : t(`errors.${failed.code}`, { email: INQUIRIES_EMAIL })}
        </div>
      )}

      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot: hidden from people, filled in by simple bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">{t("website")}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field name="fullName" label={t("fullName")} error={errorFor("fullName")}>
          <input className="field" type="text" autoComplete="name" required {...fieldProps("fullName")} />
        </Field>
        <Field name="organization" label={t("organization")} error={errorFor("organization")}>
          <input className="field" type="text" autoComplete="organization" required {...fieldProps("organization")} />
        </Field>
        <Field name="role" label={t("role")} optionalLabel={t("optional")} error={errorFor("role")}>
          <input className="field" type="text" autoComplete="organization-title" {...fieldProps("role")} />
        </Field>
        <Field name="country" label={t("country")} error={errorFor("country")}>
          <input className="field" type="text" autoComplete="country-name" required {...fieldProps("country")} />
        </Field>
        <Field name="email" label={t("email")} error={errorFor("email")}>
          <input className="field" type="email" autoComplete="email" required {...fieldProps("email")} />
        </Field>
        <Field name="phone" label={t("phone")} optionalLabel={t("optional")} error={errorFor("phone")}>
          <input className="field" type="tel" autoComplete="tel" {...fieldProps("phone")} />
        </Field>
        <Field name="counterpartyType" label={t("counterpartyType")} error={errorFor("counterpartyType")}>
          <select className="field" required key={value("counterpartyType")} {...fieldProps("counterpartyType")}>
            <option value="">{t("select")}</option>
            {COUNTERPARTY_TYPES.map((type) => (
              <option key={type} value={type}>{t(`types.${type}`)}</option>
            ))}
          </select>
        </Field>
        <Field name="service" label={t("service")} error={errorFor("service")}>
          <select className="field" required key={value("service")} {...fieldProps("service")}>
            <option value="">{t("select")}</option>
            {SERVICES.map((service) => (
              <option key={service} value={service}>{t(`services.${service}`)}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field name="scope" label={t("scope")} optionalLabel={t("optional")} error={errorFor("scope")}>
        <input className="field" type="text" {...fieldProps("scope")} />
      </Field>

      <Field name="message" label={t("message")} error={errorFor("message")}>
        <textarea className="field" rows={6} required {...fieldProps("message")} />
      </Field>

      <div>
        <label className="flex gap-3 text-[14px] text-slate">
          <input
            className="mt-1 size-4 shrink-0 accent-navy"
            id="consent"
            name="consent"
            type="checkbox"
            required
            defaultChecked={value("consent") === "on"}
            aria-invalid={failed?.fieldErrors.consent ? true : undefined}
            aria-describedby={failed?.fieldErrors.consent ? "consent-error" : undefined}
          />
          <span>
            {t("consent")}{" "}
            <Link href="/privacy" className="text-navy border-b border-gold" target="_blank">
              {t("consentLink")}
            </Link>
            .
          </span>
        </label>
        {failed?.fieldErrors.consent && (
          <p id="consent-error" className="mt-1.5 text-[14px] text-error">{errorFor("consent")}</p>
        )}
      </div>

      <div>
        <button type="submit" disabled={pending} className="btn-navy text-[13px] uppercase px-7 py-4">
          {pending ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}

export function InquiryForm() {
  // Changing the key remounts the form, which clears the action state.
  const [formKey, setFormKey] = useState(0);
  return <Form key={formKey} onReset={() => setFormKey((key) => key + 1)} />;
}
