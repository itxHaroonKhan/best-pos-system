'use server';
/**
 * @fileOverview This file implements a Genkit flow for analyzing daily sales data
 * and generating a natural language summary of key insights and trends.
 *
 * - dailySalesInsightsSummary - A function to generate a sales insights summary.
 * - DailySalesInsightsSummaryInput - The input type for the summary generation.
 * - DailySalesInsightsSummaryOutput - The output type for the summary generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailySalesInsightsSummaryInputSchema = z.object({
  date: z.string().describe('The date for which the sales data is provided (e.g., "2023-10-27").'),
  totalSalesAmount: z.number().describe('The total revenue generated on this date.'),
  numberOfTransactions: z.number().describe('The total number of sales transactions processed.'),
  averageTransactionValue: z.number().describe('The average value of each transaction.'),
  topSellingProducts: z.array(z.string()).describe('A list of the top-selling product names.'),
  leastSellingProducts: z.array(z.string()).describe('A list of the least-selling product names.'),
  totalDiscountsApplied: z.number().describe('The total monetary value of discounts applied.'),
  paymentMethodBreakdown: z.record(z.string(), z.number()).describe('An object showing the breakdown of sales by payment method (e.g., { "Cash": 1000, "Card": 2500 }).'),
  newCustomersCount: z.number().describe('The number of new customers who made a purchase.'),
  repeatCustomersCount: z.number().describe('The number of repeat customers who made a purchase.'),
});
export type DailySalesInsightsSummaryInput = z.infer<typeof DailySalesInsightsSummaryInputSchema>;

const DailySalesInsightsSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, natural language summary of key sales insights and trends for the day.'),
});
export type DailySalesInsightsSummaryOutput = z.infer<typeof DailySalesInsightsSummaryOutputSchema>;

export async function dailySalesInsightsSummary(input: DailySalesInsightsSummaryInput): Promise<DailySalesInsightsSummaryOutput> {
  return dailySalesInsightsSummaryFlow(input);
}

const dailySalesInsightsSummaryPrompt = ai.definePrompt({
  name: 'dailySalesInsightsSummaryPrompt',
  input: {schema: DailySalesInsightsSummaryInputSchema},
  output: {schema: DailySalesInsightsSummaryOutputSchema},
  prompt: `You are an AI-powered sales analyst for Elites, a retail Point of Sale system. Your task is to analyze the provided daily sales data and generate a concise, actionable natural language summary of key insights and trends. Focus on what a store manager would need to quickly understand business performance and make informed decisions.

Here is the daily sales data:
Date: {{{date}}}
Total Sales Amount: {{{totalSalesAmount}}}
Number of Transactions: {{{numberOfTransactions}}}
Average Transaction Value: {{{averageTransactionValue}}}
Top Selling Products: {{#each topSellingProducts}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Least Selling Products: {{#each leastSellingProducts}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Total Discounts Applied: {{{totalDiscountsApplied}}}
Payment Method Breakdown:
{{#each paymentMethodBreakdown}}
  - {{key}}: {{this}}
{{/each}}
New Customers: {{{newCustomersCount}}}
Repeat Customers: {{{repeatCustomersCount}}}

Please provide a summary that includes:
- Overall sales performance (e.g., total sales, number of transactions, average value).
- Key product performance (e.g., top/least sellers).
- Any notable trends or anomalies in discounts, payment methods, or customer segments.
- Actionable insights or suggestions based on the data.

Keep the summary concise and easy to read.`,
});

const dailySalesInsightsSummaryFlow = ai.defineFlow(
  {
    name: 'dailySalesInsightsSummaryFlow',
    inputSchema: DailySalesInsightsSummaryInputSchema,
    outputSchema: DailySalesInsightsSummaryOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await dailySalesInsightsSummaryPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error generating daily sales insights:', error);
      
      // Return a fallback success object with custom text so the UI doesn't crash
      return {
        summary: 'AI summaries are currently unavailable due to API rate limits (token khatam ho gaye hain). Please try again later.'
      };
    }
  }
);
