"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  HOW_FOUND_OUT_OPTIONS,
  INTEREST_AREA_OPTIONS,
  volunteerFormSchema,
  type VolunteerFormInput,
  type VolunteerFormValues,
} from "@/lib/validation";
import { maskInstagram, maskWhatsapp } from "@/lib/masks";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30";
const labelClass = "mb-2 block text-base font-semibold text-slate-800";
const errorClass = "mt-1.5 text-sm font-medium text-red-600";
const fieldWrapperClass = "mb-6";
const sectionTitleClass =
  "mb-5 border-l-4 border-brand-yellow pl-3 text-xl font-bold text-brand-blue-dark";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorClass}>{message}</p>;
}

function RadioOption({
  children,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 transition has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue-light">
      <input type="radio" className="h-4 w-4 accent-brand-blue" {...props} />
      {children}
    </label>
  );
}

export function VolunteerForm() {
  const router = useRouter();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormInput, unknown, VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      fullName: "",
      age: "",
      birthDate: "",
      neighborhood: "",
      whatsapp: "",
      email: "",
      instagram: "@",
      howFoundOut: undefined,
      referralName: "",
      otherSourceDetail: "",
      expectations: "",
      hasExperience: undefined,
      experienceDetail: "",
      interestAreas: [],
      lgpdConsent: undefined,
    } as unknown as VolunteerFormInput,
  });

  const howFoundOut = watch("howFoundOut");
  const hasExperience = watch("hasExperience");
  const lgpdConsent = watch("lgpdConsent");

  async function onSubmit(data: VolunteerFormValues) {
    setSubmitError(null);

    if (honeypotRef.current?.value) {
      router.push("/voluntariado/confirmacao");
      return;
    }

    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setSubmitError(result?.error ?? "Não foi possível enviar sua inscrição.");
        return;
      }

      router.push("/voluntariado/confirmacao");
    } catch {
      setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <section className="mb-8 rounded-xl bg-brand-blue-light p-5 sm:p-6">
        <h2 className="mb-2 text-xl font-bold text-brand-blue-dark">Antes de começar</h2>
        <p className="mb-4 text-base text-slate-700">
          Ao enviar este formulário, você concorda com a coleta e o uso dos seus dados
          pessoais para fins de contato e organização das atividades de voluntariado do Ser
          Solidário, conforme a LGPD (Lei nº 13.709/2018). Seus dados não serão compartilhados
          com terceiros sem o seu consentimento. Leia e concorde abaixo para liberar o
          restante do formulário.
        </p>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-brand-blue bg-white px-4 py-4 text-base text-slate-800">
          <input
            type="checkbox"
            {...register("lgpdConsent")}
            className="mt-0.5 h-5 w-5 accent-brand-blue"
          />
          <span>Concordo com os termos de uso de dados. *</span>
        </label>
        <FieldError message={errors.lgpdConsent?.message} />
      </section>

      {!lgpdConsent && (
        <p className="mb-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-base text-slate-500">
          Marque a opção acima para continuar o preenchimento do formulário.
        </p>
      )}

      <div hidden={!lgpdConsent} aria-hidden={!lgpdConsent}>
        <section className="mb-10">
          <h2 className={sectionTitleClass}>Seus dados</h2>

          <div className={fieldWrapperClass}>
            <label className={labelClass} htmlFor="fullName">
              Nome completo *
            </label>
            <input id="fullName" className={inputClass} {...register("fullName")} />
            <FieldError message={errors.fullName?.message} />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="age">
                Idade *
              </label>
              <input
                id="age"
                type="number"
                min={1}
                className={inputClass}
                {...register("age")}
              />
              <FieldError message={errors.age?.message} />
            </div>

            <div>
              <label className={labelClass} htmlFor="birthDate">
                Data de Nascimento *
              </label>
              <input
                id="birthDate"
                type="date"
                className={inputClass}
                {...register("birthDate")}
              />
              <FieldError message={errors.birthDate?.message} />
            </div>
          </div>

          <div className={fieldWrapperClass}>
            <label className={labelClass} htmlFor="neighborhood">
              Bairro onde mora *
            </label>
            <input id="neighborhood" className={inputClass} {...register("neighborhood")} />
            <FieldError message={errors.neighborhood?.message} />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="whatsapp">
                WhatsApp *
              </label>
              <Controller
                control={control}
                name="whatsapp"
                render={({ field }) => (
                  <input
                    id="whatsapp"
                    className={inputClass}
                    placeholder="(99) 99999-9999"
                    inputMode="numeric"
                    value={field.value}
                    onChange={(event) => field.onChange(maskWhatsapp(event.target.value))}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <FieldError message={errors.whatsapp?.message} />
            </div>

            <div>
              <label className={labelClass} htmlFor="instagram">
                Instagram *
              </label>
              <Controller
                control={control}
                name="instagram"
                render={({ field }) => (
                  <input
                    id="instagram"
                    className={inputClass}
                    placeholder="@usuario"
                    value={field.value}
                    onChange={(event) => field.onChange(maskInstagram(event.target.value))}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <FieldError message={errors.instagram?.message} />
            </div>
          </div>

          <div className={fieldWrapperClass}>
            <label className={labelClass} htmlFor="email">
              E-mail *
            </label>
            <input id="email" type="email" className={inputClass} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
        </section>

        <section className="mb-10">
          <h2 className={sectionTitleClass}>Como conheceu o Ser Solidário?</h2>
          <div className="space-y-3">
            {HOW_FOUND_OUT_OPTIONS.map((option) => (
              <RadioOption key={option.value} value={option.value} {...register("howFoundOut")}>
                {option.label}
              </RadioOption>
            ))}
          </div>
          <FieldError message={errors.howFoundOut?.message} />

          {howFoundOut === "INDICACAO_VOLUNTARIO" && (
            <div className="mt-4">
              <label className={labelClass} htmlFor="referralName">
                Nome do voluntário do Ser Solidário
              </label>
              <input
                id="referralName"
                className={inputClass}
                placeholder="Nome e Sobrenome"
                {...register("referralName")}
              />
              <FieldError message={errors.referralName?.message} />
            </div>
          )}

          {howFoundOut === "OUTRO" && (
            <div className="mt-4">
              <label className={labelClass} htmlFor="otherSourceDetail">
                Qual?
              </label>
              <input
                id="otherSourceDetail"
                className={inputClass}
                {...register("otherSourceDetail")}
              />
              <FieldError message={errors.otherSourceDetail?.message} />
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className={sectionTitleClass}>Sobre o voluntariado</h2>

          <div className={fieldWrapperClass}>
            <label className={labelClass} htmlFor="expectations">
              O que você espera aprender ou vivenciar com o voluntariado do Ser Solidário? *
            </label>
            <textarea
              id="expectations"
              rows={4}
              className={inputClass}
              {...register("expectations")}
            />
            <FieldError message={errors.expectations?.message} />
          </div>

          <div>
            <p className={labelClass}>Você já teve alguma experiência com trabalho voluntário? *</p>
            <Controller
              control={control}
              name="hasExperience"
              render={({ field }) => (
                <div className="space-y-3">
                  <RadioOption
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    onBlur={field.onBlur}
                  >
                    Sim
                  </RadioOption>
                  <RadioOption
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    onBlur={field.onBlur}
                  >
                    Não
                  </RadioOption>
                </div>
              )}
            />
            <FieldError message={errors.hasExperience?.message} />

            {hasExperience === true && (
              <div className="mt-4">
                <label className={labelClass} htmlFor="experienceDetail">
                  Conte um pouco sobre ela.
                </label>
                <textarea
                  id="experienceDetail"
                  rows={3}
                  className={inputClass}
                  {...register("experienceDetail")}
                />
                <FieldError message={errors.experienceDetail?.message} />
              </div>
            )}
          </div>
        </section>

        <section className="mb-10">
          <h2 className={sectionTitleClass}>
            Em quais áreas você gostaria de contribuir? (pode marcar mais de uma)
          </h2>
          <p className="mb-5 text-base text-slate-600">
            Não é necessário ter experiência. Escolha as áreas que despertam seu interesse ou
            nas quais você gostaria de aprender e ajudar.
          </p>
          <div className="space-y-3">
            {INTEREST_AREA_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex min-h-[4.5rem] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 transition has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue-light"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register("interestAreas")}
                  className="h-5 w-5 shrink-0 accent-brand-blue"
                />
                <span>
                  <span className="font-semibold text-slate-900">{option.label}</span>:{" "}
                  {option.description}
                </span>
              </label>
            ))}
          </div>
          <FieldError message={errors.interestAreas?.message} />
        </section>

        {submitError && <p className={`${errorClass} mb-4`}>{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-blue px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-blue-dark disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Enviando..." : "Enviar inscrição"}
        </button>
      </div>
    </form>
  );
}
