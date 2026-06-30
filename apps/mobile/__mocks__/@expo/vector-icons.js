const React = require('react');

const MockIcon = (props) => React.createElement('View', props, props.children);

module.exports = {
  Ionicons: MockIcon,
  AntDesign: MockIcon,
  MaterialIcons: MockIcon,
  Feather: MockIcon,
  FontAwesome: MockIcon,
  MaterialCommunityIcons: MockIcon,
};
