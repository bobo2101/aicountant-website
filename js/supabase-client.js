/**
 * AIcountant Supabase Client Configuration
 * 
 * This file initializes the Supabase client for authentication and database operations.
 * 
 * SETUP REQUIRED:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Copy your Project URL and anon key from Settings > API
 * 3. Replace the values below
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Option 1: Hardcoded values (for quick testing only)
// Replace with your actual Supabase credentials
const SUPABASE_URL = 'https://lwmgekggcpwfxnyphlpc.supabase.co';
// Get from https://supabase.com/dashboard/project/lwmgekggcpwfxnyphlpc/settings/api
// If you get "Invalid JWT" error, replace this with the current anon key from dashboard
// ⚠️ 从 Dashboard → Settings → API 获取 anon key (以 eyJhbGci 开头)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bWdla2dnY3B3ZnhueXBobHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzQ5NzgsImV4cCI6MjA4ODgxMDk3OH0.Ilr64FehKCbfoqzPNVgAxcGDVBTiizQyn18QM3HFDiY';

// Option 2: Environment variables (recommended for production)
// Uncomment below if using build tools that support env vars
// const SUPABASE_URL = process.env.SUPABASE_URL;
// const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// ============================================
// INITIALIZE SUPABASE CLIENT
// ============================================

let supabaseClient = null;

function initSupabase() {
    // Check if already initialized
    if (supabaseClient) {
        return supabaseClient;
    }

    // Validate configuration
    if (!SUPABASE_URL || SUPABASE_URL.includes('your-project-ref')) {
        console.error('❌ Supabase URL not configured. Please update js/supabase-client.js');
        console.error('   Get your credentials from: https://supabase.com/dashboard/project/_/settings/api');
        return null;
    }

    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('your-anon-key')) {
        console.error('❌ Supabase Anon Key not configured. Please update js/supabase-client.js');
        return null;
    }

    try {
        // Initialize Supabase client
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                storage: localStorage,
                storageKey: 'aicountant-supabase-auth'
            },
            global: {
                headers: {
                    'X-Client-Info': 'aicountant-portal'
                }
            }
        });

        console.log('✅ Supabase client initialized');
        return supabaseClient;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
    }
}

// Initialize immediately
initSupabase();

// ============================================
// AUTHENTICATION HELPERS
// ============================================

/**
 * Check if user is logged in
 * @returns {Promise<Object|null>} User object or null
 */
async function getCurrentUser() {
    if (!supabaseClient) return null;

    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Check if user is logged in (synchronous check from session)
 * @returns {Promise<boolean>}
 */
async function isLoggedIn() {
    if (!supabaseClient) return false;

    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        return !!session;
    } catch (error) {
        console.error('Error checking session:', error);
        return false;
    }
}

/**
 * Require authentication - redirect to login if not authenticated
 * Use this at the start of protected pages
 */
async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        console.log('🔒 User not authenticated, redirecting to login...');
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

/**
 * Sign up new user
 * @param {string} email 
 * @param {string} password 
 * @param {Object} metadata - Optional user metadata (full_name, company_name)
 * @returns {Promise<Object>}
 */
async function signUp(email, password, metadata = {}) {
    if (!supabaseClient) {
        return { error: { message: 'Supabase not initialized' } };
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) throw error;

        console.log('✅ Sign up successful:', data.user.email);
        return { data, error: null };
    } catch (error) {
        console.error('❌ Sign up failed:', error.message);
        return { data: null, error };
    }
}

/**
 * Sign in existing user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
async function signIn(email, password) {
    if (!supabaseClient) {
        return { error: { message: 'Supabase not initialized' } };
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        console.log('✅ Sign in successful:', data.user.email);
        return { data, error: null };
    } catch (error) {
        console.error('❌ Sign in failed:', error.message);
        return { data: null, error };
    }
}

/**
 * Sign out current user
 * @returns {Promise<Object>}
 */
async function signOut() {
    if (!supabaseClient) {
        return { error: { message: 'Supabase not initialized' } };
    }

    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        console.log('✅ Sign out successful');

        // Clear any local storage items
        localStorage.removeItem('aicountant-portal-user');

        // Redirect to login
        window.location.href = 'login.html';

        return { error: null };
    } catch (error) {
        console.error('❌ Sign out failed:', error.message);
        return { error };
    }
}

/**
 * Send password reset email
 * @param {string} email 
 * @returns {Promise<Object>}
 */
async function resetPassword(email) {
    if (!supabaseClient) {
        return { error: { message: 'Supabase not initialized' } };
    }

    try {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/portal/reset-password.html'
        });

        if (error) throw error;

        console.log('✅ Password reset email sent');
        return { data, error: null };
    } catch (error) {
        console.error('❌ Password reset failed:', error.message);
        return { data: null, error };
    }
}

/**
 * Update user password
 * @param {string} newPassword 
 * @returns {Promise<Object>}
 */
async function updatePassword(newPassword) {
    if (!supabaseClient) {
        return { error: { message: 'Supabase not initialized' } };
    }

    try {
        const { data, error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        console.log('✅ Password updated successfully');
        return { data, error: null };
    } catch (error) {
        console.error('❌ Password update failed:', error.message);
        return { data: null, error };
    }
}

// ============================================
// DATABASE HELPERS
// ============================================

/**
 * Get user's profile
 * @returns {Promise<Object>}
 */
async function getProfile() {
    if (!supabaseClient) return { data: null, error: { message: 'Supabase not initialized' } };

    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return { data: null, error };
    }
}

/**
 * Update user's profile
 * @param {Object} updates 
 * @returns {Promise<Object>}
 */
async function updateProfile(updates) {
    if (!supabaseClient) return { data: null, error: { message: 'Supabase not initialized' } };

    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabaseClient
            .from('profiles')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { data: null, error };
    }
}

// ============================================
// TRANSACTIONS
// ============================================

/**
 * Get all transactions for current user
 * @param {Object} filters - Optional filters (type, category, date range)
 * @returns {Promise<Object>}
 */
async function getTransactions(filters = {}) {
    if (!supabaseClient) return { data: null, error: { message: 'Supabase not initialized' } };

    try {
        let query = supabaseClient
            .from('transactions')
            .select('*')
            .order('transaction_date', { ascending: false });

        // Apply filters
        if (filters.type) {
            query = query.eq('type', filters.type);
        }
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.startDate) {
            query = query.gte('transaction_date', filters.startDate);
        }
        if (filters.endDate) {
            query = query.lte('transaction_date', filters.endDate);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { data: null, error };
    }
}

/**
 * Create new transaction
 * @param {Object} transaction 
 * @returns {Promise<Object>}
 */
async function createTransaction(transaction) {
    if (!supabaseClient) return { data: null, error: { message: 'Supabase not initialized' } };

    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabaseClient
            .from('transactions')
            .insert([{ ...transaction, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating transaction:', error);
        return { data: null, error };
    }
}

/**
 * Update transaction
 * @param {string} id 
 * @param {Object} updates 
 * @returns {Promise<Object>}
 */
async function updateTransaction(id, updates) {
    if (!supabaseClient) return { data: null, error: { message: 'Supabase not initialized' } };

    try {
        const { data, error } = await supabaseClient
            .from('transactions')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating transaction:', error);
        return { data: null, error };
    }
}

/**
 * Delete transaction
 * @param {string} id 
 * @returns {Promise<Object>}
 */
async function deleteTransaction(id) {
    if (!supabaseClient) return { data: null, error: { message: 'Supabase not initialized' } };

    try {
        const { error } = await supabaseClient
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return { error };
    }
}

// ============================================
// DASHBOARD STATS
// ============================================

/**
 * Get dashboard statistics
 * @returns {Promise<Object>}
 */
async function getDashboardStats() {
    if (!supabaseClient) return { data: null, error: { message: 'Supabase not initialized' } };

    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get current month's transactions
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: transactions, error } = await supabaseClient
            .from('transactions')
            .select('type, amount')
            .gte('transaction_date', startOfMonth.toISOString().split('T')[0])
            .eq('status', 'completed');

        if (error) throw error;

        // Calculate stats
        const stats = {
            income: 0,
            expenses: 0,
            profit: 0,
            pendingInvoices: 0
        };

        transactions.forEach(t => {
            if (t.type === 'income') {
                stats.income += parseFloat(t.amount);
            } else {
                stats.expenses += parseFloat(t.amount);
            }
        });

        stats.profit = stats.income - stats.expenses;

        // Get pending invoices count
        const { count, error: invoiceError } = await supabaseClient
            .from('invoices')
            .select('*', { count: 'exact' })
            .in('status', ['sent', 'overdue']);

        if (!invoiceError) {
            stats.pendingInvoices = count || 0;
        }

        return { data: stats, error: null };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { data: null, error };
    }
}

// ============================================
// AUTH STATE LISTENER
// ============================================

/**
 * Listen for auth state changes
 * @param {Function} callback - Function to call on auth change
 */
function onAuthStateChange(callback) {
    if (!supabaseClient) return;

    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        callback(event, session);
    });
}

// Listen for auth changes and log them
onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', session?.user?.email);
    } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
    } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
    }
});

// ============================================
// EXPORT FOR MODULES (if using ES modules)
// ============================================

// If using ES modules, uncomment below:
// export { 
//     supabaseClient,
//     initSupabase,
//     getCurrentUser,
//     isLoggedIn,
//     requireAuth,
//     signUp,
//     signIn,
//     signOut,
//     resetPassword,
//     updatePassword,
//     getProfile,
//     updateProfile,
//     getTransactions,
//     createTransaction,
//     updateTransaction,
//     deleteTransaction,
//     getDashboardStats,
//     onAuthStateChange
// };

console.log('📦 Supabase client module loaded');
console.log('   Make sure to update SUPABASE_URL and SUPABASE_ANON_KEY in this file');
