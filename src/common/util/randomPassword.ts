export function generateStrongPassword(length = 12): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '@$!%*?&';
  const allChars = lower + upper + numbers + special;

  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  // Đảm bảo có đủ 1 ký tự mỗi loại
  let password = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  // Bổ sung ký tự ngẫu nhiên còn lại
  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle mảng password
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}

export function randomSixNumbers(): number {
  const min = 100000; // Số nhỏ nhất có 6 chữ số
  const max = 999999; // Số lớn nhất có 6 chữ số
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
