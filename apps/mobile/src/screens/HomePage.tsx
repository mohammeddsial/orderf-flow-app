import React, { useState } from 'react';
import { View } from 'react-native';
import { useMenuItems, useTenant, useCurrentUser } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout } from '../components/Layout';
import { getHomeSectionConfig } from '../api/client';
import {
  HeroSection,
  HomeHeader,
  Gutter,
  LoyaltyCard,
  OrderAgainRail,
  Recommendations,
  CategoryTiles,
  FeaturedTier,
  StoriesRail,
  PopularRail,
  RestaurantBrowser,
  FlashCountdown,
  CartRecovery,
  ActiveTracker,
  DEMO_STORIES,
  DEMO_REORDERS,
  DEMO_FLASH,
  DEMO_ACTIVE_ORDER,
  DEMO_ABANDONED,
  MealDealCombo,
  AnnouncementStrip,
  ImageMosaic,
  BirthdayBanner, // ✅ added
  OfferBanner,
} from '../components/home';

// The Home screen renders sections according to the layout configured in the
// web-admin "Home Layout" page (fetched on launch, with an offline default).
export const HomePage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens } = useTheme();
  const tenant = useTenant();
  const user = useCurrentUser();
  const menuItems = useMenuItems();

  const [location, setLocation] = useState('Home');
  const [fulfillment, setFulfillment] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');

  const isGuest = false;
  const liveOn = false;

  const sections = getHomeSectionConfig();

  const recommended = menuItems.filter((i) => i.category === 'Burgers').slice(0, 2);
  const featured = menuItems.find((i) => i.title.includes('Deluxe')) ?? menuItems[1];
  const popular = menuItems.slice(0, 5);

  const points = user?.loyaltyProfile.pointsBalance ?? 0;
  const tier = user?.loyaltyProfile.tier ?? 'BRONZE';
  const progress = Math.min(1, points / 1000);

  const goToProduct = (id: string) => navigation.navigate('ProductDetail', { itemId: id });
  const goToMenu = (category?: string) =>
    navigation.navigate('Menu', category ? { category } : undefined);

  const renderSection = (key: string): React.ReactNode => {
    const cfg = sections.find((x) => x.key === key);
    const variant = cfg?.variant;
    const heading = cfg?.heading;
    const media = cfg?.media;
    switch (key) {
      case 'hero':
        return <HeroSection brandName={tenant.name} onExplore={() => goToMenu()} variant={variant} media={media} />;
      case 'cartRecovery':
        return (
          <Gutter>
            <CartRecovery cart={DEMO_ABANDONED} onResume={() => navigation.navigate('Cart')} />
          </Gutter>
        );
      case 'loyalty':
        return (
          <Gutter>
            <LoyaltyCard
              isGuest={isGuest}
              points={points}
              tier={tier}
              progress={progress}
              onPress={() => navigation.navigate('Rewards')}
            />
          </Gutter>
        );
      case 'orderAgain':
        return isGuest ? null : <OrderAgainRail orders={DEMO_REORDERS} onReorder={() => goToMenu()} heading={heading} />;
      case 'recommendations':
        return <Recommendations items={recommended} onSelect={goToProduct} variant={variant} heading={heading} />;
      case 'popular':
        return <PopularRail items={popular} onSelect={goToProduct} variant={variant} heading={heading} />;
      case 'browser':
        return <RestaurantBrowser onSelect={goToProduct} heading={heading} />;
      case 'featured':
        return <FeaturedTier item={featured} onSelect={goToProduct} variant={variant} heading={heading} />;
      case 'flashDeal':
        return <FlashCountdown deal={DEMO_FLASH} onClaim={() => goToMenu('Burgers')} content={cfg?.content} />;
      case 'categories':
        return <CategoryTiles onCategory={(cat) => goToMenu(cat)} heading={heading} />;
      case 'mealDeal':
        return <MealDealCombo onSelect={(combo) => console.log('Combo added:', combo)} />;
      case 'offer':
        return <OfferBanner onPress={() => goToMenu()} title={heading} />;

      case 'imageMosaic':
        return <ImageMosaic onTilePress={(tile) => console.log('Tile pressed:', tile)} heading={heading} />;
      case 'stories':
        return <StoriesRail stories={DEMO_STORIES} />;

      case 'announcement':
        return <AnnouncementStrip />;
      case 'birthday':
        return <BirthdayBanner onClaim={() => console.log('Birthday claim pressed')} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <ScreenLayout scrollable paddingHorizontal={0}>
        {sections
          .filter((s) => s.enabled)
          .map((s) => (
            <React.Fragment key={s.key}>{renderSection(s.key)}</React.Fragment>
          ))}
        <View style={{ height: 140 }} />
      </ScreenLayout>

      <HomeHeader
        brandName={tenant.name}
        location={location}
        onToggleLocation={() => setLocation((l) => (l === 'Home' ? 'Work' : 'Home'))}
        fulfillment={fulfillment}
        onFulfillment={setFulfillment}
      />

      {liveOn ? (
        <ActiveTracker order={DEMO_ACTIVE_ORDER} onTrack={() => navigation.navigate('OrderSuccess')} />
      ) : null}
    </View>
  );
};

export default HomePage;