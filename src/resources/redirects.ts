type Redirects = Array<{
  type: 'exact' | 'regex';
  from: string | RegExp;
  to: string;
  temporary: boolean;
  expires: false | number;
}>;

export const redirects: Redirects = [
  {
    type: 'exact',
    from: '/example',
    to: '/our-services',
    temporary: true,
    expires: 2000000000000
  },
  {
    type: 'regex',
    from: /^\/hello$/,
    to: '/about',
    temporary: true,
    expires: 2000000000000
  }
];
