export type SortOrder = 'ascending' | 'descending';
export type SortProperty = 'title' | 'created_at' | 'updated_at';
export type SortState = {
	order: SortOrder;
	property: SortProperty;
};
