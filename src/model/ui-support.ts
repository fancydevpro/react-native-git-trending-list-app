import React from 'react';

export type RenderProp<Props = {}> = (props?: Props) => React.ReactElement;
