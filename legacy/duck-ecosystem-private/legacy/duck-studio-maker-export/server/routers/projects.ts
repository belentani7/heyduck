import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { createProject, getProjectsByUser, getProjectById, deleteProject } from "../db";
import { generateImage } from "../_core/imageGeneration";
import { storagePut } from "../storage";

export const projectsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await getProjectsByUser(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await getProjectById(input.id);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found");
      }
      return project;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        type: z.enum(["flyer", "business_card", "qr_code"]),
        data: z.record(z.string(), z.any()),
        previewUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payload: any = {
        userId: ctx.user.id,
        title: input.title,
        type: input.type,
        data: input.data,
        previewUrl: input.previewUrl || null,
      };
      const insertId = await createProject(payload);
      return { id: insertId, success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const success = await deleteProject(input.id, ctx.user.id);
      return { success };
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const original = await getProjectById(input.id);
      if (!original || original.userId !== ctx.user.id) {
        throw new Error("Project not found");
      }
      const newId = await createProject({
        userId: ctx.user.id,
        title: `${original.title} (Copy)`,
        type: original.type,
        data: original.data as any,
        previewUrl: original.previewUrl,
      } as any);
      return { id: newId, success: true };
    }),

  aiEnhance: protectedProcedure
    .input(z.object({ prompt: z.string(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const fullPrompt = `Professional music producer ${input.type} design for DUCK PRODUÇÃO MUSICAL. ${input.prompt}. Cinematic dark green and neon green aesthetic, high resolution, professional typography.`;
        const result = await generateImage({ prompt: fullPrompt });
        if (result && result.url) {
          return { success: true, url: result.url };
        }
        throw new Error("Generation failed");
      } catch (err: any) {
        console.error("AI Enhance error:", err);
        return { success: false, error: err.message || "Failed to generate AI asset" };
      }
    }),
});
