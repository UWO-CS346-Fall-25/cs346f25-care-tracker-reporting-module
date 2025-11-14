/**
 * Module: Provides logic for this feature.
 */

const supabase = require('./supabase');

class CareTrackerConfig {
  static async getAll() {
    const { data, error } = await supabase
      .from('dropdown_codes')
      .select('code_type, code_group, code_text, code_meaning') // Ensure you select these columns
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // --- START DATA MAPPING ---
    return data.map(c => ({
      // EJS uses CodeType
      CodeType: c.code_type,
      // EJS uses CodeGroup
      CodeGroup: c.code_group,
      // EJS uses Code (which is code_text in the DB)
      Code: c.code_text,
      // EJS uses CodeMeaning
      CodeMeaning: c.code_meaning
    }));
    // --- END DATA MAPPING ---
  }

  static async create(config) {
    const { data, error } = await supabase
      .from('dropdown_codes')
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = CareTrackerConfig;