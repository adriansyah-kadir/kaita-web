import * as v from "valibot";
import type { Attachment } from "svelte/attachments";
import { preventDefault } from "svelte/legacy";

type AnyObjectSchema = v.ObjectSchema<any, any> | v.ObjectSchemaAsync<any, any>;
type MaybePromise<T> = T | Promise<T>;

type Issue = { message: string };
type IssuesFor<TSchema extends AnyObjectSchema> = {
  [K in keyof v.InferOutput<TSchema>]: Issue[];
};

type FormStateOptions<TSchema extends AnyObjectSchema> = {
  onSubmit?: (values: v.InferOutput<TSchema>) => MaybePromise<any>;
};

export default class FormState<TSchema extends AnyObjectSchema> {
  readonly schema: TSchema;
  readonly onSubmit: (values: v.InferOutput<TSchema>) => MaybePromise<void>;

  issues = $state<IssuesFor<TSchema>>({} as IssuesFor<TSchema>);
  validating = $state(false);
  submitting = $state(false);

  invalid = $derived(Object.values(this.issues).some((issues) => issues.length > 0));
  node = $state<HTMLFormElement>()

  constructor(schema: TSchema, options: FormStateOptions<TSchema> = {}) {
    this.schema = schema;
    this.onSubmit = options.onSubmit ?? (() => { });
    this.reset();
  }

  attach(): Attachment {
    return node => {
      const form = node.closest("form")
      if (!form) return;
      return this.#setup(form)
    }
  }

  #setup(form: HTMLFormElement) {
    const handle = preventDefault(this.#handleSubmit.bind(this, form))

    this.node = form
    form.addEventListener("submit", handle);
    form.addEventListener("reset", this.reset)
    return () => {
      this.node = undefined
      form.removeEventListener("submit", handle)
      form.removeEventListener("reset", this.reset)
    }
  }

  reset = () => {
    for (const key of Object.keys(this.schema.entries)) {
      (this.issues as any)[key] = [];
    }
  }

  async #handleSubmit(form: HTMLFormElement) {
    this.reset();

    const output = await this.#validate(new FormData(form));
    if (output === undefined) return;

    this.submitting = true;
    try {
      await this.onSubmit(output);
    } finally {
      this.submitting = false;
    }
  }

  async #validate(formData: FormData) {
    this.validating = true;
    try {

      const data = Object.fromEntries(Object.entries(this.schema.entries as Record<string, v.BaseSchemaAsync<any, any, any>>).map(([k, s]) => {
        if (s.type === "array") return [k, formData.getAll(k)]
        return [k, formData.get(k)]
      }));

      const result = await v.safeParseAsync(this.schema, data, {
        abortEarly: false,
        abortPipeEarly: false,
      });

      for (const issue of result.issues ?? []) {
        const key = String(issue.path?.[0]?.key ?? "");
        this.#addIssue(key, issue.message);
      }

      return result.success && !this.invalid ? result.output : undefined;
    } finally {
      this.validating = false;
    }
  }

  #addIssue(key: keyof v.InferOutput<TSchema>, message: string) {
    (this.issues[key] ??= []).push({ message });
  }
}
