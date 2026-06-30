import React, { useState, useCallback } from 'react';
import { View, TextInput, ScrollView, FlatList, Pressable, Text, Modal, Image } from 'react-native';
import { useMenuItems, useMenuItemsByCategory, useCart, MenuItem, store } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import {
  ScreenLayout,
  Card,
  Heading,
  BodyText,
  Button,
  SolidHeader,
} from '../components/Layout';
import { SectionHeader, QuickAddButton, cardChrome, EngineId } from '../components/home';
import { getMenuSectionConfig } from '../api/client';

export const MenuPage: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const allMenuItems = useMenuItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'Burgers');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  const menuCfg = getMenuSectionConfig();
  const showSection = (key: string) => menuCfg.find((s) => s.key === key)?.enabled ?? true;

  const categories: string[] = ['Burgers', 'Sides', 'Drinks', 'Desserts'];
  const dietaryOptions = ['Vegan', 'Gluten-Free', 'Halal', 'Nut-Free'];

  const filteredItems = allMenuItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = useCallback(() => {
    if (selectedItem && cart) {
      try {
        cart.addToCart(selectedItem.id, quantity);
        setCustomizerOpen(false);
        setQuantity(1);
        setSelectedItem(null);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  }, [selectedItem, quantity, cart]);

  const SearchAndFilters = () => (
    <View style={{ marginBottom: tokens.spacing.lg }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.border,
          borderWidth: tokens.borders.thin,
          borderRadius: tokens.borders.radiusMd,
          paddingHorizontal: tokens.spacing.md,
          marginBottom: tokens.spacing.md,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, marginRight: tokens.spacing.sm }}>🔍</Text>
        <TextInput
          placeholder="Search menu..."
          placeholderTextColor={tokens.colors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            paddingVertical: tokens.spacing.md,
            fontSize: tokens.typography.fontSizeMd,
            color: tokens.colors.text,
          }}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {dietaryOptions.map(option => (
          <Pressable
            key={option}
            onPress={() => {
              setSelectedDietary(prev =>
                prev.includes(option)
                  ? prev.filter(d => d !== option)
                  : [...prev, option]
              );
            }}
            style={{
              paddingVertical: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.md,
              marginRight: tokens.spacing.sm,
              backgroundColor: selectedDietary.includes(option)
                ? tokens.colors.primary
                : tokens.colors.surfaceInverse,
              borderRadius: tokens.borders.radiusPill,
              borderColor: tokens.colors.border,
              borderWidth: tokens.borders.thin,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.fontSizeSm,
                fontWeight: '600',
                color: selectedDietary.includes(option)
                  ? tokens.colors.textInverse
                  : tokens.colors.text,
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const CategoryNav = () => (
    <View
      style={{
        backgroundColor: tokens.colors.background,
        borderBottomColor: tokens.colors.border,
        borderBottomWidth: tokens.borders.thin,
        paddingHorizontal: tokens.spacing.md,
        marginHorizontal: -tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        marginBottom: tokens.spacing.lg,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {categories.map(category => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={{
              paddingVertical: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.lg,
              marginRight: tokens.spacing.md,
              borderBottomColor: selectedCategory === category
                ? tokens.colors.primary
                : 'transparent',
              borderBottomWidth: selectedCategory === category ? 2 : 0,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.fontSizeMd,
                fontWeight: selectedCategory === category ? '700' : '400',
                color: selectedCategory === category
                  ? tokens.colors.primary
                  : tokens.colors.textDisabled,
              }}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const ProductGrid = () => (
    <View style={{ marginBottom: 100 }}>
      {filteredItems.map(item => (
        <Pressable
          key={item.id}
          onPress={() => {
            setSelectedItem(item);
            setCustomizerOpen(true);
          }}
        >
          <View
            style={{
              padding: tokens.spacing.md,
              marginBottom: tokens.spacing.md,
              ...cardChrome(tokens, engine),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <Heading level={4}>{item.title}</Heading>
                <BodyText
                  size="sm"
                  color={tokens.colors.textDisabled}
                  marginBottom={tokens.spacing.sm}
                >
                  {item.description}
                </BodyText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Heading level={4}>${item.basePrice.toFixed(2)}</Heading>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                    <BodyText size="sm" color={tokens.colors.textDisabled}>
                      {item.calories} cal
                    </BodyText>
                    <QuickAddButton
                      onAdd={() => {
                        try {
                          store.addToCart(item.id, 1);
                        } catch {
                          /* no-op */
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
              <Image
                source={{ uri: item.imageUrl }}
                resizeMode="cover"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: tokens.colors.surfaceInverse,
                  borderRadius: engine === 'BRUTALIST_MODERNIST' ? 0 : tokens.borders.radiusMd,
                  marginLeft: tokens.spacing.md,
                }}
              />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );

  const CustomizerSheet = () => (
    <Modal
      visible={customizerOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setCustomizerOpen(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: tokens.colors.background,
            borderTopLeftRadius: tokens.borders.radiusLg,
            borderTopRightRadius: tokens.borders.radiusLg,
            paddingHorizontal: tokens.spacing.lg,
            paddingVertical: tokens.spacing.lg,
            maxHeight: '80%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: tokens.spacing.lg,
            }}
          >
            <Heading level={2}>{selectedItem?.title}</Heading>
            <Pressable onPress={() => setCustomizerOpen(false)}>
              <Text style={{ fontSize: 24 }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedItem?.modifiers.map(modifier => (
              <View key={modifier.id} style={{ marginBottom: tokens.spacing.lg }}>
                <Heading level={4}>{modifier.name}</Heading>
                <BodyText size="sm" color={tokens.colors.textDisabled} marginBottom={tokens.spacing.md}>
                  Select up to {modifier.maxSelection}
                </BodyText>
                {modifier.options.map(option => (
                  <Pressable
                    key={option.id}
                    style={{
                      paddingVertical: tokens.spacing.md,
                      borderBottomColor: tokens.colors.border,
                      borderBottomWidth: tokens.borders.thin,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <BodyText>{option.name}</BodyText>
                    {option.price > 0 && (
                      <BodyText color={tokens.colors.accent}>
                        +${option.price.toFixed(2)}
                      </BodyText>
                    )}
                  </Pressable>
                ))}
              </View>
            ))}

            <View style={{ marginBottom: tokens.spacing.lg }}>
              <Heading level={4} marginBottom={tokens.spacing.md}>
                Quantity
              </Heading>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.borders.radiusMd,
                  paddingHorizontal: tokens.spacing.md,
                }}
              >
                <Pressable
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ paddingVertical: tokens.spacing.md }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '700' }}>−</Text>
                </Pressable>
                <Text style={{ fontSize: tokens.typography.fontSizeLg, fontWeight: '700' }}>
                  {quantity}
                </Text>
                <Pressable
                  onPress={() => setQuantity(quantity + 1)}
                  style={{ paddingVertical: tokens.spacing.md }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '700' }}>+</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <Button
            label={`Add to Cart • $${(selectedItem?.basePrice || 0).toFixed(2)}`}
            onPress={handleAddToCart}
            size="lg"
          />
        </View>
      </View>
    </Modal>
  );

  const MiniCartFooter = () => (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: tokens.colors.surface,
        borderTopColor: tokens.colors.border,
        borderTopWidth: tokens.borders.thin,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
      }}
    >
      {cart && cart.itemCount > 0 ? (
        <Pressable
          onPress={() => navigation.navigate('Cart')}
          style={{
            backgroundColor: tokens.colors.primary,
            borderRadius: tokens.borders.radiusMd,
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: tokens.typography.fontSizeMd,
              fontWeight: '700',
              color: tokens.colors.textInverse,
            }}
          >
            {cart.itemCount} items
          </Text>
          <Text
            style={{
              fontSize: tokens.typography.fontSizeMd,
              fontWeight: '700',
              color: tokens.colors.textInverse,
            }}
          >
            ${cart.subtotal.toFixed(2)} →
          </Text>
        </Pressable>
      ) : (
        <Text
          style={{
            fontSize: tokens.typography.fontSizeMd,
            color: tokens.colors.textDisabled,
            textAlign: 'center',
            paddingVertical: tokens.spacing.md,
          }}
        >
          Your cart is empty
        </Text>
      )}
    </View>
  );

  return (
    <>
      <SolidHeader
        title="Menu"
        onBackPress={() => navigation.goBack()}
      />
      <ScreenLayout scrollable={false} paddingHorizontal={0}>
        {showSection('search') && (
          <View style={{ paddingHorizontal: tokens.spacing.md }}>
            <SearchAndFilters />
          </View>
        )}
        {showSection('categories') && <CategoryNav />}
        {showSection('grid') && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: tokens.spacing.md }}>
              <SectionHeader title={selectedCategory} />
              <ProductGrid />
            </View>
          </ScrollView>
        )}
      </ScreenLayout>
      <MiniCartFooter />
      <CustomizerSheet />
    </>
  );
};

export default MenuPage;
