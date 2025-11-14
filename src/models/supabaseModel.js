/**
 * Model: Provides data-access logic and interaction with the database or external services.
 */

// supabaseModel.js (CommonJS)
const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj ?? {}).filter(([_, v]) => v !== undefined)
  );

const defaultListOpts = {
  limit: 100,
  offset: 0,
  orderBy: 'created_at',
  ascending: false,
  withSoftDeleted: false,
};

function makeModels(supabase) {
  if (!supabase) throw new Error('Supabase client is required');

  const base = (table) => ({
    async create(data) {
      const { data: rows, error } = await supabase
        .from(table)
        .insert(clean(data))
        .select()
        .single();
      if (error) throw error;
      return rows;
    },
    async updateById(idCol, id, patch) {
      const body = clean(patch);
      if (!id) throw new Error(`Missing ${idCol}`);
      if (Object.keys(body).length === 0) return this.getById(idCol, id);
      const { data: rows, error } = await supabase
        .from(table)
        .update(body)
        .eq(idCol, id)
        .select()
        .single();
      if (error) throw error;
      return rows;
    },
    async getById(idCol, id) {
      const { data: row, error } = await supabase
        .from(table)
        .select('*')
        .eq(idCol, id)
        .single();
      if (error) {
        if (
          error.code === 'PGRST116' ||
          error.details?.includes('Results contain 0 rows')
        )
          return null;
        throw error;
      }
      return row;
    },
    async list(opts = {}) {
      const o = { ...defaultListOpts, ...opts };
      let query = supabase.from(table).select('*', { count: 'exact' });
      if (typeof o.filters === 'function') query = o.filters(query) ?? query;
      if (o.withSoftDeleted === false)
        query = query.is('soft_delete_date', null);
      query = query
        .order(o.orderBy, { ascending: o.ascending })
        .range(o.offset, o.offset + o.limit - 1);
      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: data ?? [], count };
    },
  });

  const CareUsers = {
    table: 'care_users',
    idCol: 'user_id',
    ...base('care_users'),
    async create(data) {
      return base('care_users').create(data);
    },
    async update(user_id, patch) {
      return base('care_users').updateById('user_id', user_id, patch);
    },
    async getById(user_id) {
      return base('care_users').getById('user_id', user_id);
    },
    async list(opts) {
      return base('care_users').list(opts);
    },
  };

  const Classrooms = {
    table: 'classrooms',
    idCol: 'classroom_id',
    ...base('classrooms'),
    async create(data) {
      return base('classrooms').create(data);
    },
    async update(classroom_id, patch) {
      return base('classrooms').updateById('classroom_id', classroom_id, patch);
    },
    async getById(classroom_id) {
      return base('classrooms').getById('classroom_id', classroom_id);
    },
    async list(opts) {
      return base('classrooms').list(opts);
    },
  };

  const ClinicalHoursReports = {
    table: 'clinical_hours_reports',
    idCol: 'report_id',
    ...base('clinical_hours_reports'),
    async create(data) {
      return base('clinical_hours_reports').create(data);
    },
    async update(report_id, patch) {
      return base('clinical_hours_reports').updateById(
        'report_id',
        report_id,
        patch
      );
    },
    async getById(report_id) {
      return base('clinical_hours_reports').getById('report_id', report_id);
    },
    async list(opts) {
      return base('clinical_hours_reports').list(opts);
    },
    async listByUser(user_id, opts) {
      return this.list({ ...opts, filters: (q) => q.eq('user_id', user_id) });
    },
    async listByClassroom(classroom_id, opts) {
      return this.list({
        ...opts,
        filters: (q) => q.eq('classroom_id', classroom_id),
      });
    },
    async setApproval(
      report_id,
      {
        approval_state,
        approval_date = new Date().toISOString(),
        instructor_id,
        instructor_name,
      } = {}
    ) {
      return this.update(
        report_id,
        clean({ approval_state, approval_date, instructor_id, instructor_name })
      );
    },
  };

  const DropdownCodes = {
    table: 'dropdown_codes',
    idCol: 'code_id',
    ...base('dropdown_codes'),
    async create(data) {
      return base('dropdown_codes').create(data);
    },
    async update(code_id, patch) {
      return base('dropdown_codes').updateById('code_id', code_id, patch);
    },
    async getById(code_id) {
      return base('dropdown_codes').getById('code_id', code_id);
    },
    async list(opts) {
      return base('dropdown_codes').list(opts);
    },
    async listByType(type, { code_group, ...opts } = {}) {
      return this.list({
        ...opts,
        filters: (q) => {
          q = q.eq('code_type', type);
          if (code_group) q = q.eq('code_group', code_group);
          return q;
        },
      });
    },
  };

  const UserClassroomMap = {
    table: 'user_classroom_map',
    idCol: 'user_classroom_map_id',
    ...base('user_classroom_map'),
    async create(data) {
      return base('user_classroom_map').create(data);
    },
    async update(user_classroom_map_id, patch) {
      return base('user_classroom_map').updateById(
        'user_classroom_map_id',
        user_classroom_map_id,
        patch
      );
    },
    async getById(user_classroom_map_id) {
      return base('user_classroom_map').getById(
        'user_classroom_map_id',
        user_classroom_map_id
      );
    },
    async list(opts) {
      return base('user_classroom_map').list(opts);
    },
    async listByUser(user_id, opts) {
      return this.list({ ...opts, filters: (q) => q.eq('user_id', user_id) });
    },
    async listByClassroom(classroom_id, opts) {
      return this.list({
        ...opts,
        filters: (q) => q.eq('classroom_id', classroom_id),
      });
    },
  };

  return {
    CareUsers,
    Classrooms,
    ClinicalHoursReports,
    DropdownCodes,
    UserClassroomMap,
  };
}

module.exports = { makeModels };
