import { z } from "zod";

const baseNodeSchema = z.object({
  label: z.string(),
  secondaryLabel: z.string().optional(),
  description: z.string().optional(),
  mediaUrl: z.string().optional(), // Typically a image src field but could also be video
  comment: z.string().optional(), // Intended for use by API to qualify data for this node like last updated, etc.
  value: z.number(),
  percent: z.number().optional(),
});

const genericAssetSchema = baseNodeSchema.extend({
  type: z.literal("generic-asset"),
  // TODO refactor schema to maybe add different asset schemas so that we can
  // make these required for IPTs but never for regular generic assets
  moleculesBalance: z.number().optional(),
  moleculesSymbol: z.string().optional(),
});

type GenericAsset = z.infer<typeof genericAssetSchema>;

const fungibleAssetSchema = baseNodeSchema.extend({
  type: z.literal("fungible-asset"),
  balance: z.number(),
  price: z.number(),
  symbol: z.string(),
});

type FungibleAsset = z.infer<typeof fungibleAssetSchema>;

export const assetSchema = z.union([genericAssetSchema, fungibleAssetSchema]);

export type Asset = z.infer<typeof assetSchema>;

export const treasuryGroupSchema: z.ZodType<TreasuryGroup> =
  baseNodeSchema.extend({
    type: z.literal("group"),
    children: z.lazy(() =>
      z.union([assetSchema.array(), treasuryGroupSchema.array()])
    ),
  });

export type TreasuryGroup = z.infer<typeof baseNodeSchema> & {
  type: "group";
  children: Asset[] | TreasuryGroup[];
};
