const supabase = require('./supabase');

class StudentsModel {
  static async getAll() {
    const { data, error } = await supabase
      .from('v_students')
      .select('user_id, full_name') // Ensure you select these columns
      .order('full_name');

    if (error) throw error;

    // --- START DATA MAPPING ---
    return data.map((c) => ({
      // EJS uses CodeType
      userId: c.user_id,
      // EJS uses CodeGroup
      fullName: c.full_name,
    }));
    // --- END DATA MAPPING ---
  }
}

module.exports = StudentsModel;
