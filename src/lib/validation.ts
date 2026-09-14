import { z } from "zod";

export const HOW_FOUND_OUT_OPTIONS = [
  { value: "REDES_SOCIAIS", label: "Redes sociais" },
  { value: "INDICACAO_VOLUNTARIO", label: "Indicação por outro voluntário" },
  { value: "INDICACAO_AMIGOS_FAMILIA", label: "Indicação de amigos/família" },
  { value: "OUTRO", label: "Outro" },
] as const;

export const INTEREST_AREA_OPTIONS = [
  {
    value: "MIDIAS_SOCIAIS_MARKETING",
    label: "Mídias Sociais e Marketing",
    description:
      "criação e gerenciamento do conteúdo de divulgação e participação nos stories do Instagram",
  },
  {
    value: "FOTOS_VIDEOS",
    label: "Fotos e Vídeos",
    description: "fotografar e registrar os momentos das ações e eventos",
  },
  {
    value: "RECREACAO_OFICINAS",
    label: "Recreação e Oficinas",
    description: "ajudar na organização e realização das atividades e oficinas",
  },
  {
    value: "CULINARIA_ALIMENTACAO",
    label: "Culinária e Alimentação",
    description: "ajudar no preparo e organização de lanches e alimentos",
  },
  {
    value: "ORGANIZACAO_LOGISTICA",
    label: "Organização e Logística",
    description:
      "preparar e separar materiais, organizar os itens necessários para as ações e ajudar no transporte e na montagem",
  },
] as const;

const WHATSAPP_REGEX = /^\(\d{2}\) \d{5}-\d{4}$/;
const INSTAGRAM_REGEX = /^@[a-zA-Z0-9._]{1,30}$/;

const howFoundOutEnum = z.enum([
  "REDES_SOCIAIS",
  "INDICACAO_VOLUNTARIO",
  "INDICACAO_AMIGOS_FAMILIA",
  "OUTRO",
]);

const interestAreaEnum = z.enum([
  "MIDIAS_SOCIAIS_MARKETING",
  "FOTOS_VIDEOS",
  "RECREACAO_OFICINAS",
  "CULINARIA_ALIMENTACAO",
  "ORGANIZACAO_LOGISTICA",
]);

export const volunteerFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Informe o nome completo."),
    age: z.coerce
      .number({ message: "Informe a idade." })
      .int("A idade deve ser um número inteiro.")
      .min(1, "Informe uma idade válida.")
      .max(120, "Informe uma idade válida."),
    birthDate: z
      .string()
      .min(1, "Informe a data de nascimento.")
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Informe uma data válida.",
      })
      .refine((value) => new Date(value).getTime() <= Date.now(), {
        message: "A data de nascimento não pode ser no futuro.",
      }),
    neighborhood: z.string().trim().min(2, "Informe o bairro onde mora."),
    whatsapp: z
      .string()
      .regex(WHATSAPP_REGEX, "Informe o WhatsApp no formato (99) 99999-9999."),
    email: z.string().trim().email("Informe um e-mail válido."),
    instagram: z
      .string()
      .trim()
      .regex(INSTAGRAM_REGEX, "Informe o Instagram no formato @usuario."),
    howFoundOut: howFoundOutEnum,
    referralName: z.string().trim().optional().or(z.literal("")),
    otherSourceDetail: z.string().trim().optional().or(z.literal("")),
    expectations: z
      .string()
      .trim()
      .min(10, "Conte um pouco mais sobre o que você espera."),
    hasExperience: z.boolean({ message: "Selecione uma opção." }),
    experienceDetail: z.string().trim().optional().or(z.literal("")),
    interestAreas: z
      .array(interestAreaEnum)
      .min(1, "Selecione pelo menos uma área de interesse."),
    lgpdConsent: z.literal(true, {
      message: "É necessário concordar com o uso dos seus dados para continuar.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.howFoundOut === "INDICACAO_VOLUNTARIO" && !data.referralName?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["referralName"],
        message: "Informe o nome do voluntário que indicou.",
      });
    }

    if (data.howFoundOut === "OUTRO" && !data.otherSourceDetail?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["otherSourceDetail"],
        message: "Conte como você conheceu o Ser Solidário.",
      });
    }

    if (data.hasExperience && !data.experienceDetail?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["experienceDetail"],
        message: "Conte um pouco sobre sua experiência.",
      });
    }
  });

export type VolunteerFormInput = z.input<typeof volunteerFormSchema>;
export type VolunteerFormValues = z.output<typeof volunteerFormSchema>;
