import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xavgvscajknuyrlvjkob.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhdmd2c2NhamtudXlybHZqa29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1MDg5NTgsImV4cCI6MjA0MTA4NDk1OH0.4OdRuebB1buHoDF2UjrQe8RGf7MluWnPtY3bG-2PoJo';

export const supabase = createClient(supabaseUrl, supabaseKey);