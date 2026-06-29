import React, { useState } from 'react';
import { View } from 'react-native';
import { useMenuItems, useTenant, useCurrentUser } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout } from '../components/Layout';
import { SideDrawer } from '../components/SideDrawer';
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
  FlashCountdown,
  CartRecovery,
  ActiveTracker,
  DemoControls,
  DEMO_STORIES,
  DEMO_REORDERS,
  DEMO_FLASH,
  DEMO_ACTIVE_ORDER,
  DEMO_ABANDONED,
  AnnouncementStrip
} from '../components/home';
import { ImageMosaic, MealDealCombo } from '../components/home';
import { ItemCard } from '../components/home/cards';

// The Home screen renders sections according to the layout configured in the
// web-admin "Home Layout" page (fetched on launch, with an offline default).
export const HomePage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens } = useTheme();
  const tenant = useTenant();
  const user = useCurrentUser();
  const menuItems = useMenuItems();

  const [location, setLocation] = useState('Home');
  const [fulfillment, setFulfillment] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isGuest, setIsGuest] = useState(false);
  const [flashOn, setFlashOn] = useState(true);
  const [cartOn, setCartOn] = useState(true);
  const [liveOn, setLiveOn] = useState(false);

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

  const renderSection = (key: string, cardVariant?: string): React.ReactNode => {
    switch (key) {
      case 'hero':
        return <HeroSection brandName={tenant.name} onExplore={() => goToMenu()} />;
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
        return isGuest ? null : <OrderAgainRail orders={DEMO_REORDERS} onReorder={() => goToMenu()} />;
      case 'recommendations':
        return <Recommendations items={recommended} onSelect={goToProduct} cardVariant={cardVariant} />;
      case 'flashDeal':
        return (
          <Gutter>
            <FlashCountdown deal={DEMO_FLASH} onClaim={() => goToMenu('Burgers')} />
          </Gutter>
        );
      case 'categories':
        return <CategoryTiles onCategory={(cat) => goToMenu(cat)} />;
      case 'featured':
        return <FeaturedTier item={featured} onSelect={goToProduct} />;
      case 'stories':
        return <StoriesRail stories={DEMO_STORIES} />;
      case 'popular':
        return <PopularRail items={popular} onSelect={goToProduct} cardVariant={cardVariant} />;
      case 'announcement':
        return <AnnouncementStrip />;
      case 'imageMosaic':
        return <ImageMosaic onTilePress={(tile) => console.log('Tile pressed:', tile)} />;
      case 'mealDeal':
        return <MealDealCombo onSelect={() => goToMenu()} />;
      case 'videoSection':
        return (
          <Gutter>
            {featured ? (
              <ItemCard
                variant={cardVariant ?? 'video'}
                item={featured}
                onPress={goToProduct}
              />
            ) : null}
          </Gutter>
        );
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
            <React.Fragment key={s.key}>{renderSection(s.key, s.cardVariant)}</React.Fragment>
          ))}
        <View style={{ height: 140 }} />
      </ScreenLayout>

      {/* Fixed translucent header overlay */}
      <HomeHeader
        brandName={tenant.name}
        location={location}
        onToggleLocation={() => setLocation((l) => (l === 'Home' ? 'Work' : 'Home'))}
        fulfillment={fulfillment}
        onFulfillment={setFulfillment}
        onMenu={() => setDrawerOpen(true)}
      />

      {/* Side drawer */}
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tenantName={tenant.name}
        fulfillment={fulfillment}
        onFulfillment={setFulfillment}
        customerLocation={location}
        tenantLocation={tenant.name}
        onNavigate={(key) => {
          if (key === 'rewards') navigation.navigate('Rewards');
          if (key === 'orders') navigation.navigate('OrderSuccess');
        }}
      />

      {/* Floating active-order tracker */}
      {liveOn ? (
        <ActiveTracker order={DEMO_ACTIVE_ORDER} onTrack={() => navigation.navigate('OrderSuccess')} />
      ) : null}

      {/* Demo controls — engine switcher + module toggles */}
      <DemoControls
        isGuest={isGuest}
        setIsGuest={setIsGuest}
        flashOn={flashOn}
        setFlashOn={setFlashOn}
        cartOn={cartOn}
        setCartOn={setCartOn}
        liveOn={liveOn}
        setLiveOn={setLiveOn}
      />
    </View>
  );
};

export default HomePage;
