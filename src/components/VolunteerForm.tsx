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
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const errorClass = "mt-1 text-sm text-red-600";
const fieldWrapperClass = "mb-5";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorClass}>{message}</p>;
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

      <div className={fieldWrapperClass}>
        <label className={labelClass} htmlFor="fullName">
          Nome completo *
        </label>
        <input id="fullName" className={inputClass} {...register("fullName")} />
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <fieldset className={fieldWrapperClass}>
        <legend className={labelClass}>Como conheceu o Ser Solidário? *</legend>
        <div className="space-y-2">
          {HOW_FOUND_OUT_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                value={option.value}
                {...register("howFoundOut")}
                className="h-4 w-4"
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError message={errors.howFoundOut?.message} />

        {howFoundOut === "INDICACAO_VOLUNTARIO" && (
          <div className="mt-3">
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
          <div className="mt-3">
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
      </fieldset>

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

      <fieldset className={fieldWrapperClass}>
        <legend className={labelClass}>
          Você já teve alguma experiência com trabalho voluntário? *
        </legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              value="true"
              {...register("hasExperience", { setValueAs: (value) => value === "true" })}
              className="h-4 w-4"
            />
            Sim
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              value="false"
              {...register("hasExperience", { setValueAs: (value) => value === "true" })}
              className="h-4 w-4"
            />
            Não
          </label>
        </div>
        <FieldError message={errors.hasExperience?.message} />

        {hasExperience === true && (
          <div className="mt-3">
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
      </fieldset>

      <fieldset className={fieldWrapperClass}>
        <legend className={labelClass}>
          Em quais áreas você gostaria de contribuir como voluntário no Ser Solidário? *
          (pode marcar mais de um)
        </legend>
        <p className="mb-3 text-sm text-slate-500">
          Não é necessário ter experiência. Escolha as áreas que despertam seu interesse ou nas
          quais você gostaria de aprender e ajudar.
        </p>
        <div className="space-y-3">
          {INTEREST_AREA_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                value={option.value}
                {...register("interestAreas")}
                className="mt-0.5 h-4 w-4"
              />
              <span>
                <span className="font-medium">{option.label}</span>: {option.description}
              </span>
            </label>
          ))}
        </div>
        <FieldError message={errors.interestAreas?.message} />
      </fieldset>

      <div className={fieldWrapperClass}>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            {...register("lgpdConsent")}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            Concordo com o uso dos meus dados pessoais para fins de contato e organização do
            voluntariado do Ser Solidário. *
          </span>
        </label>
        <FieldError message={errors.lgpdConsent?.message} />
      </div>

      {submitError && <p className={`${errorClass} mb-4`}>{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Enviando..." : "Enviar inscrição"}
      </button>
    </form>
  );
}
