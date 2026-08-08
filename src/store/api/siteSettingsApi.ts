import { baseApi } from './baseApi';

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  announcementText: string;
  announcementPhone: string;
  showAnnouncementBar: boolean;
  phonePrimary: string;
  phoneSecondary?: string;
  emergencyHotline: string;
  email: string;
  address: string;
  businessHours: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialWhatsapp?: string;
  socialLinkedin?: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutSummary: string;
  footerAboutText: string;
  footerCopyright: string;
  googleMapsEmbed?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  privacyPolicy?: string;
  termsOfService?: string;
  googleAnalyticsId?: string;
  customHeaderScripts?: string;
}

export const siteSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteSettings: builder.query<SiteSettings, void>({
      query: () => '/site-settings',
      providesTags: ['SiteSettings'],
    }),
    updateSiteSettings: builder.mutation<SiteSettings, Partial<SiteSettings>>({
      query: (data) => ({
        url: '/site-settings',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['SiteSettings'],
    }),
    uploadLogo: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/site-settings/upload-logo',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  useUploadLogoMutation,
} = siteSettingsApi;
