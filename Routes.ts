const Routes = {
  home: '/',
  login: '/signin',
  signup: '/signup',
  resetPassword: '/reset/password',

  // Static pages
  aboutUs: '/about',
  contact: '/contact',
  services: '/services',
  faq: '/faq',
  blog: '/blog?status=coming-soon',
  careers: '/careers?status=coming-soon',
  terms: '/terms',
  privacy: '/privacy',

  // Listings
  listings: '/listings',
  buy: '/for-sale',
  rent: '/for-rent',
  shortLet: '/short-let?status=coming-soon',
  newHomes: '/new-homes?status=coming-soon',
  luxury: '/luxury-homes?status=coming-soon',
  commercial: '/commercial?status=coming-soon',
  land: '/land?status=coming-soon',
  neighborhoods: '/neighborhoods?status=coming-soon',
  agents: '/agents?status=coming-soon',
  mortgage: '/mortgage?status=coming-soon',
  calculator: '/mortgage/calculator?status=coming-soon',

  // Dashboard
  dashboard: {
        'account management' : {
            'account information': '/dashboard/account',
            'social profile': '/dashboard/account/socials',
            'password': '/dashboard/account/password',
        },
        'professional tools' : {
            'professional details': '/dashboard/tools/details',
            'my properties': '/dashboard/tools/properties',
            'add new properties': '/dashboard/tools/add-new',
            'my plan': '/dashboard/tools/plan',
        },
        engagement: {
            message: '/dashboard/engagement/message',
            reviews: '/dashboard/engagement/reviews',
            favourites: '/dashboard/engagement/favourites',
        },
        settings: {
            'alarm & nofitications': '/dashboard/settings/notifications',
        }
        
    }
};

export default Routes;
