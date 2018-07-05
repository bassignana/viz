import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from '../../src/components/Button';

console.log('Button type:', typeof Button)
console.log(Button)

storiesOf("Button", module).add("default", () => (
  <Button title="Log in" onPress={() => {}} />
));
