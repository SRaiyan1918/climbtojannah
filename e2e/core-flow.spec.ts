import { expect,test } from '@playwright/test';

async function register(page:import('@playwright/test').Page){
  const email=`flow-${Date.now()}@example.test`;
  await page.goto('/register');
  await page.getByLabel('Name').fill('Flow User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password',{exact:true}).fill('StrongPass123!');
  await page.getByLabel('Confirm password').fill('StrongPass123!');
  await page.getByRole('button',{name:'Create account'}).click();
  await expect(page).toHaveURL(/verify-email/);
  await page.goto('/');
}

test('core private tracking flow persists across features',async({page})=>{
  await register(page);
  await page.goto('/routine');
  await expect(page.getByRole('heading',{name:'Routine',exact:true})).toBeVisible();
  await page.getByLabel('Goal title').fill('Study 45 minutes');
  await page.getByRole('button',{name:'Add goal'}).click();
  await expect(page.getByText('Study 45 minutes').first()).toBeVisible();
  const goalRow=page.locator('label.check-row').filter({hasText:'Study 45 minutes'});
  await goalRow.getByRole('checkbox').check();
  await page.goto('/salah');
  const fajr=page.locator('.prayer-card').filter({hasText:'Fajr'});
  await fajr.getByRole('button',{name:'Mark complete'}).click();
  await expect(fajr.getByRole('button',{name:/Completed/})).toBeVisible();
  await page.goto('/quran');
  await page.getByLabel('Minutes').fill('12');
  await page.getByRole('button',{name:'Add activity'}).click();
  await expect(page.getByText('12 min')).toBeVisible();
  await page.goto('/self-control');
  await page.getByLabel('Habit to avoid').fill('Late-night scrolling');
  await page.getByRole('button',{name:'Add privately'}).click();
  await expect(page.getByText('Late-night scrolling')).toBeVisible();
  await page.getByRole('button',{name:'Record slip'}).click();
  await page.getByLabel('Private recovery note (optional)').fill('Reset and continue.');
  await page.getByRole('button',{name:'Record & restart'}).click();
  await expect(page.getByText('0 clean days')).toBeVisible();
  await page.goto('/journal');
  await page.getByLabel('Journal entry').fill('A private test reflection.');
  await page.getByRole('button',{name:'Save reflection'}).click();
  await page.goto('/progress');
  await expect(page.getByRole('heading',{name:'Progress',exact:true})).toBeVisible();
  await expect(page.getByText(/scheduled routine items were completed/)).toBeVisible();
});
