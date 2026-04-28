// ─── E2E Tests: Habit Tracker App ────────────────────────────────────────────

import { test, expect, type Page } from '@playwright/test'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

async function seedUser(page: Page, email: string, password: string) {
  await page.evaluate(({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('habit-tracker-users') ?? '[]')
    users.push({
      id:        `user-${Date.now()}`,
      email,
      password,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('habit-tracker-users', JSON.stringify(users))
  }, { email, password })
}

async function seedSession(page: Page, userId: string, email: string) {
  await page.evaluate(({ userId, email }) => {
    localStorage.setItem('habit-tracker-session', JSON.stringify({ userId, email }))
  }, { userId, email })
}

async function signup(page: Page, email: string, password: string) {
  await page.goto('/signup')
  await page.getByTestId('auth-signup-email').fill(email)
  await page.getByTestId('auth-signup-password').fill(password)
  await page.getByTestId('auth-signup-submit').click()
  await page.waitForURL('**/dashboard')
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Habit Tracker app', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
  })

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Seed a session first
    await page.goto('/')
    await seedUser(page, 'root@garden.com', 'pass123')
    const users = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('habit-tracker-users') ?? '[]')
    )
    await seedSession(page, users[0].id, users[0].email)

    await page.goto('/')
    await page.waitForURL('**/dashboard', { timeout: 5000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await signup(page, 'newsprout@garden.com', 'growgrow')

    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    const session = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null')
    )
    expect(session).not.toBeNull()
    expect(session.email).toBe('newsprout@garden.com')
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Sign up user A
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('usera@garden.com')
    await page.getByTestId('auth-signup-password').fill('passA')
    await page.getByTestId('auth-signup-submit').click()
    await page.waitForURL('**/dashboard')

    // Add a habit for user A
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('User A Habit')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-user-a-habit')).toBeVisible()

    // Log out
    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('**/login')

    // Sign up user B
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('userb@garden.com')
    await page.getByTestId('auth-signup-password').fill('passB')
    await page.getByTestId('auth-signup-submit').click()
    await page.waitForURL('**/dashboard')

    // User B should see empty state (no user A habits)
    await expect(page.getByTestId('empty-state')).toBeVisible()
    await expect(page.getByTestId('habit-card-user-a-habit')).not.toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await signup(page, 'creator@garden.com', 'plant123')

    await page.getByTestId('create-habit-button').click()
    await expect(page.getByTestId('habit-form')).toBeVisible()

    await page.getByTestId('habit-name-input').fill('Morning Meditation')
    await page.getByTestId('habit-description-input').fill('10 minutes at dawn')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-morning-meditation')).toBeVisible()

    const habits = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('habit-tracker-habits') ?? '[]')
    )
    expect(habits.length).toBe(1)
    expect(habits[0].name).toBe('Morning Meditation')
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await signup(page, 'completer@garden.com', 'done123')

    // Create a habit
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()

    // Streak should be 0
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('0')

    // Complete the habit
    await page.getByTestId('habit-complete-drink-water').click()

    // Streak should update to 1
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await signup(page, 'persistent@garden.com', 'stay123')

    // Create a habit
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Evening Walk')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-evening-walk')).toBeVisible()

    // Reload
    await page.reload()

    // Should still be on dashboard with habit visible
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('habit-card-evening-walk')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await signup(page, 'logout@garden.com', 'bye123')

    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('**/login', { timeout: 5000 })

    expect(page.url()).toContain('/login')

    const session = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null')
    )
    expect(session).toBeNull()
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // First, load the app online so SW can cache it
    await signup(page, 'offline@garden.com', 'cache123')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    // Wait for SW to install
    await page.waitForTimeout(2000)

    // Go offline
    await context.setOffline(true)

    // Navigate to root — should not hard crash
    await page.goto('/')
    
    // The app shell should render (either splash or redirected page — not a browser error)
    const title = await page.title()
    expect(title).not.toBe('')

    // Re-enable network
    await context.setOffline(false)
  })
})
