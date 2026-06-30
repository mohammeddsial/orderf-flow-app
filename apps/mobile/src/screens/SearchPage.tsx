import React, { useState } from 'react';
import { View, TextInput, Pressable, FlatList, Image } from 'react-native';
import { useMenuItems, store } from '@multi-restaurant/database';
import { useTheme } from '../theme';
import { ScreenLayout, Card, Heading, BodyText, SolidHeader } from '../components/Layout';
import { Icon } from '../components/shared/Icon';
import { cardChrome, type EngineId } from '../components/home/engineStyle';

const SearchPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tokens, engineStyle } = useTheme();
  const engine = engineStyle as EngineId;
  const allItems = useMenuItems();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = [...new Set(allItems.map((i) => i.category))];
  const filtered = allItems.filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase());
    const matchCategory = !category || i.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <SolidHeader title="Search" onBackPress={() => navigation.goBack()} />
      <ScreenLayout scrollable>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.md, gap: tokens.spacing.sm }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.surface, borderRadius: tokens.borders.radiusMd, borderWidth: tokens.borders.widthThin, borderColor: tokens.colors.border, paddingHorizontal: tokens.spacing.md }}>
            <Icon name="search" size={20} color={tokens.colors.textDisabled} />
            <TextInput
              placeholder="Search menu..."
              placeholderTextColor={tokens.colors.textDisabled}
              value={query}
              onChangeText={setQuery}
              style={{ flex: 1, paddingVertical: tokens.spacing.md, marginLeft: tokens.spacing.sm, fontSize: tokens.typography.fontSizeMd, color: tokens.colors.text }}
            />
          </View>
        </View>

        <FlatList
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setCategory(category === item ? null : item)}
              style={{
                paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.sm,
                backgroundColor: category === item ? tokens.colors.primary : tokens.colors.surface,
                borderRadius: tokens.borders.radiusPill,
              }}
            >
              <BodyText size="sm" color={category === item ? tokens.colors.textInverse : tokens.colors.text}>{item}</BodyText>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        />

        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: tokens.spacing.xl }}>
            <Icon name="search" size={48} color={tokens.colors.textDisabled} />
            <Heading level={3} marginBottom={tokens.spacing.xs}>No results</Heading>
            <BodyText color={tokens.colors.textDisabled}>Try a different search term</BodyText>
          </View>
        ) : (
          <View style={{ gap: tokens.spacing.sm }}>
            {filtered.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => navigation.navigate('ProductDetail', { itemId: item.id })}
                style={{ flexDirection: 'row', padding: tokens.spacing.md, backgroundColor: tokens.colors.surface, borderRadius: tokens.borders.radiusMd, borderWidth: tokens.borders.widthThin, borderColor: tokens.colors.borderLight }}
              >
                <Image source={{ uri: item.imageUrl }} style={{ width: 64, height: 64, borderRadius: tokens.borders.radiusSm, marginRight: tokens.spacing.md }} />
                <View style={{ flex: 1 }}>
                  <Heading level={4}>{item.title}</Heading>
                  <BodyText size="sm" color={tokens.colors.textDisabled} numberOfLines={1}>{item.description}</BodyText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: tokens.spacing.xs }}>
                    <BodyText size="sm" color={tokens.colors.accent}>${item.basePrice.toFixed(2)}</BodyText>
                    {item.calories > 0 && <BodyText size="sm" color={tokens.colors.textDisabled}> • {item.calories} cal</BodyText>}
                  </View>
                </View>
                <Pressable onPress={() => store.addToCart(item.id, 1)} style={{ justifyContent: 'center', paddingLeft: tokens.spacing.sm }}>
                  <Icon name="cart" size={24} color={tokens.colors.accent} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </ScreenLayout>
    </>
  );
};

export default SearchPage;
