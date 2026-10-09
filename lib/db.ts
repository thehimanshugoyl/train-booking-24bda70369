/**
 * Database connection resolver.
 * MongoDB is replaced by Supabase (PostgreSQL).
 * This function provides a safe zero-error bridge for backwards compatibility.
 */
export async function connectDB() {
  return true;
}