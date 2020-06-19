// MaterialTable's ref doesn't allow calling onQueryChange.
// This is a dirty escape.
// In other word, there is a problem in MaterialTable's type def.
export function callMTonQueryChange(mt, query) {
    mt.onQueryChange(query);
}
