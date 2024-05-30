import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";

# Background Wrapper

`<BackgroundWrapper>` applies a selectable background style to its child components. 

:::info

Most of the time you do not want to put a `<BackgroundWrapper>` inside a `<BoundaryBox>` because it would add a margin around it. However, it is common to place a `<BoundaryBox>` inside a `<BackgroundWrapper>`.

:::

## Background Styles

You can select between different background types by passing the backgroundType to the component. 

### Solid Grey
```
<BackgroundWrapper backgroundType="solidGrey">
```

#### Result
<BackgroundWrapper backgroundType="solidGrey">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### Solid Blue
```
<BackgroundWrapper backgroundType="solidBlue">
```

#### Result
<BackgroundWrapper backgroundType="solidBlue">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### Zoom
```
<BackgroundWrapper backgroundType="zoom">
```

#### Result
<BackgroundWrapper backgroundType="zoom">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.<br />
  <br />
  This needs<br />
  more space<br />
  to breathe.<br />
  <br />
  Way more.  
</BackgroundWrapper>

### gradientLight
```
<BackgroundWrapper backgroundType="gradientLight">
```

#### Result
<BackgroundWrapper backgroundType="gradientLight">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### gradientDark
```
<BackgroundWrapper backgroundType="gradientDark">
```

#### Result
<BackgroundWrapper backgroundType="gradientDark">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### ada
```
<BackgroundWrapper backgroundType="ada">
```

#### Result
<BackgroundWrapper backgroundType="ada">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.<br />
  <br />
  This needs<br />
  more space<br />
  to breathe.<br />
  <br />
  Way more. 
</BackgroundWrapper>

### none (default)
<BackgroundWrapper>
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>
 