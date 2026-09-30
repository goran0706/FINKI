/**
 * Images and Alt Text
 * ====================
 *
 * Images communicate information, establish visual context, provide navigation, or exist only
 * for decoration. Accessible image implementation depends on the purpose of each image and
 * whether its information is already available in surrounding content.
 *
 * The `alt` attribute provides a text alternative for an image when an alternative is needed.
 * Decorative images should generally use an empty `alt` value so assistive technologies can
 * ignore them rather than announcing irrelevant content.
 */

import { type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. The purpose of alt text
// ---------------------------------------------------------------------

// The alt attribute provides a text alternative for an image.
//
// The alternative should communicate the image's relevant purpose or
// information rather than simply describing its visual appearance.
//
// The correct alt text depends on why the image is present.

// ---------------------------------------------------------------------
// 2. Alt text is purpose-dependent
// ---------------------------------------------------------------------

export type ImagePurpose = "Informative" | "Decorative" | "Functional" | "Text" | "Complex" | "Redundant";

export interface ImagePurposeExample {
  readonly purpose: ImagePurpose;
  readonly explanation: string;
}

export const imagePurposeExamples: readonly ImagePurposeExample[] = [
  {
    purpose: "Informative",
    explanation: "The image communicates information that users need.",
  },
  {
    purpose: "Decorative",
    explanation: "The image adds visual decoration without meaningful information.",
  },
  {
    purpose: "Functional",
    explanation: "The image is part of a control or link and communicates its function.",
  },
  {
    purpose: "Text",
    explanation: "The image contains meaningful text that is not otherwise available.",
  },
  {
    purpose: "Complex",
    explanation: "The image communicates substantial information that needs a longer alternative.",
  },
  {
    purpose: "Redundant",
    explanation: "The same information is already provided in nearby text.",
  },
];

// There is no universally correct alt string for an image.
//
// The surrounding content and the image's role determine what the
// alternative should communicate.

// ---------------------------------------------------------------------
// 3. Basic informative image
// ---------------------------------------------------------------------

export const InformativeImage = (): ReactElement => {
  return <img src="/example-product.jpg" alt="Example product shown from the front" />;
};

// This image communicates information about the product.
//
// The alt text identifies the subject and the relevant visual information.

// ---------------------------------------------------------------------
// 4. Alt text should communicate purpose
// ---------------------------------------------------------------------

export const ProductImage = (): ReactElement => {
  return (
    <article>
      <h2>Example product</h2>

      <img src="/example-product.jpg" alt="Example product with a black exterior and silver control panel" />

      <p>The product includes a silver control panel and a black exterior.</p>
    </article>
  );
};

// The best alternative depends on what information the image contributes
// to the surrounding content.
//
// It does not need to reproduce every visible detail.

// ---------------------------------------------------------------------
// 5. Empty alt text for decorative images
// ---------------------------------------------------------------------

export const DecorativeImage = (): ReactElement => {
  return <img src="/example-divider.png" alt="" />;
};

// An empty alt value tells assistive technologies that the image does not
// provide information that needs to be conveyed.
//
// This is different from omitting the alt attribute.

// ---------------------------------------------------------------------
// 6. Empty alt versus missing alt
// ---------------------------------------------------------------------

export const EmptyAltExample = (): ReactElement => {
  return <img src="/example-decoration.png" alt="" />;
};

// Empty alt:
//
// alt=""
//
// communicates that the image is intentionally decorative.
//
// Missing alt:
//
// <img src="..." />
//
// does not make the image explicitly decorative and can lead to poor or
// inconsistent experiences for assistive technology users.

// ---------------------------------------------------------------------
// 7. Do not put filenames in alt text
// ---------------------------------------------------------------------

export const PoorFilenameAlt = (): ReactElement => {
  return <img src="/example-product.jpg" alt="example-product.jpg" />;
};

// A filename rarely communicates the image's purpose.
//
// Alt text should communicate useful information rather than the
// implementation detail of the image file.

// ---------------------------------------------------------------------
// 8. Avoid "image of" when unnecessary
// ---------------------------------------------------------------------

export const ConciseAlt = (): ReactElement => {
  return <img src="/example-person.jpg" alt="John Doe" />;
};

// Assistive technologies already communicate that the element is an image
// in contexts where the image role is exposed.
//
// Adding "image of" or "picture of" is usually unnecessary unless that
// wording contributes meaningful context.

// ---------------------------------------------------------------------
// 9. Alt text should be concise
// ---------------------------------------------------------------------

export const ConciseImageDescription = (): ReactElement => {
  return <img src="/example-landscape.jpg" alt="Mountain lake surrounded by pine forest" />;
};

// Alt text should normally communicate the relevant information directly.
//
// It should not become a long visual inventory of every visible detail
// unless those details are actually important.

// ---------------------------------------------------------------------
// 10. Do not describe irrelevant details
// ---------------------------------------------------------------------

export const RelevantAltText = (): ReactElement => {
  return <img src="/example-chair.jpg" alt="Adjustable office chair" />;
};

// If the purpose is to identify the product, irrelevant details such as
// the exact wall color or floor texture do not need to be included.

// ---------------------------------------------------------------------
// 11. Context changes the correct alt text
// ---------------------------------------------------------------------

export const ContextualImageExample = (): ReactElement => {
  return (
    <section>
      <h2>Example chair</h2>

      <p>The example chair supports adjustable lumbar positioning.</p>

      <img src="/example-chair.jpg" alt="Office chair with adjustable lumbar support" />
    </section>
  );
};

// The same image can require different alt text in different contexts.
//
// Alt text should communicate the information relevant to the current
// content and task.

// ---------------------------------------------------------------------
// 12. Decorative background images
// ---------------------------------------------------------------------

export const DecorativeBackground = (): ReactElement => {
  return (
    <section className="decorative-banner">
      <h2>Example section</h2>
      <p>Content remains available without the decorative image.</p>
    </section>
  );
};

// CSS background images are commonly used for decoration.
//
// If a background image communicates essential information, it should not
// be the only way that information is conveyed.

// ---------------------------------------------------------------------
// 13. Informative CSS background images
// ---------------------------------------------------------------------

export const BackgroundImageWarning = (): ReactElement => {
  return (
    <section className="product-banner">
      <h2>Example product</h2>
      <p>Example product description.</p>
    </section>
  );
};

// Do not place essential content exclusively in a CSS background image.
//
// If users need the information, provide it through actual content or an
// appropriate text alternative.

// ---------------------------------------------------------------------
// 14. Functional images
// ---------------------------------------------------------------------

export const FunctionalImage = (): ReactElement => {
  return (
    <a href="/example/profile">
      <img src="/example-profile.jpg" alt="John Doe's profile" />
    </a>
  );
};

// When an image is the content of a link, its alternative should communicate
// the destination or purpose of the link.
//
// The important information is what the control does, not merely what the
// image looks like.

// ---------------------------------------------------------------------
// 15. Image used inside a button
// ---------------------------------------------------------------------

export const ImageButton = (): ReactElement => {
  return (
    <button type="button" aria-label="Open menu">
      <img src="/example-menu-icon.svg" alt="" />
    </button>
  );
};

// The button needs an accessible name because the icon itself is not
// meaningful independently.
//
// The decorative icon can therefore use an empty alt value.

// ---------------------------------------------------------------------
// 16. Do not duplicate the button name
// ---------------------------------------------------------------------

export const DuplicateButtonName = (): ReactElement => {
  return (
    <button type="button" aria-label="Open menu">
      <img src="/example-menu-icon.svg" alt="" />
    </button>
  );
};

// The accessible name is provided by the button.
//
// Giving the same text to the image would unnecessarily duplicate the
// control's name.

// ---------------------------------------------------------------------
// 17. Image links with visible text
// ---------------------------------------------------------------------

export const ImageAndTextLink = (): ReactElement => {
  return (
    <a href="/example/profile">
      <img src="/example-profile.jpg" alt="" />
      <span>John Doe</span>
    </a>
  );
};

// When visible text already identifies the destination, a nearby image
// that adds no additional information can be decorative.

// ---------------------------------------------------------------------
// 18. Informative image beside visible text
// ---------------------------------------------------------------------

export const RedundantImage = (): ReactElement => {
  return (
    <article>
      <img src="/example-warning.svg" alt="" />
      <h2>Warning</h2>
      <p>Review the information before continuing.</p>
    </article>
  );
};

// If an image communicates the same information as adjacent text, the
// image can often be decorative.
//
// This prevents the same information from being announced twice.

// ---------------------------------------------------------------------
// 19. Logos
// ---------------------------------------------------------------------

export const LogoExample = (): ReactElement => {
  return (
    <a href="/example">
      <img src="/example-logo.svg" alt="Example" />
    </a>
  );
};

// When a logo is a link, its alternative commonly identifies the linked
// organization or destination.
//
// The appropriate wording depends on the surrounding context.

// ---------------------------------------------------------------------
// 20. Logo with adjacent visible name
// ---------------------------------------------------------------------

export const LogoWithText = (): ReactElement => {
  return (
    <a href="/example">
      <img src="/example-logo.svg" alt="" />
      <span>Example</span>
    </a>
  );
};

// When the visible text already provides the name and purpose of the link,
// the logo can be decorative.

// ---------------------------------------------------------------------
// 21. Decorative icon
// ---------------------------------------------------------------------

export const DecorativeIcon = (): ReactElement => {
  return (
    <p>
      <img src="/example-check.svg" alt="" />
      Changes saved.
    </p>
  );
};

// The text communicates the status.
//
// The icon adds visual reinforcement but does not need to be announced
// separately.

// ---------------------------------------------------------------------
// 22. Meaningful icon
// ---------------------------------------------------------------------

export const MeaningfulIcon = (): ReactElement => {
  return (
    <p>
      <img src="/example-warning.svg" alt="Warning" />
      Review the information before continuing.
    </p>
  );
};

// If the icon communicates information that is not otherwise available,
// its alternative should communicate that information.

// ---------------------------------------------------------------------
// 23. Images containing text
// ---------------------------------------------------------------------

export const ImageContainingText = (): ReactElement => {
  return <img src="/example-sale-banner.png" alt="Example sale: 25% off selected products" />;
};

// If meaningful text exists only inside an image, the text alternative
// should communicate that text when it is necessary to understand the
// content.

// ---------------------------------------------------------------------
// 24. Text inside images should be avoided when possible
// ---------------------------------------------------------------------

export const PreferRealText = (): ReactElement => {
  return (
    <section>
      <h2>Example sale</h2>
      <p>25% off selected products.</p>
    </section>
  );
};

// Real HTML text is generally more flexible than text embedded in an
// image.
//
// It can be resized, restyled, translated, selected, searched, and
// exposed directly to assistive technologies.

// ---------------------------------------------------------------------
// 25. Complex images
// ---------------------------------------------------------------------

export interface ComplexImageProps {
  readonly title: string;
  readonly description: string;
}

export const ComplexImage = ({ title, description }: ComplexImageProps): ReactElement => {
  return (
    <figure>
      <img src="/example-chart.png" alt={title} />
      <figcaption>{description}</figcaption>
    </figure>
  );
};

// Complex images such as charts, diagrams, and maps may communicate more
// information than can reasonably fit into a short alt attribute.
//
// Additional nearby text can provide the detailed equivalent.

// ---------------------------------------------------------------------
// 26. Chart alternative
// ---------------------------------------------------------------------

export const ChartExample = (): ReactElement => {
  return (
    <figure>
      <img src="/example-sales-chart.png" alt="Monthly sales chart" />
      <figcaption>Sales increased from January through March, with March having the highest value.</figcaption>
    </figure>
  );
};

// The alt text identifies the image and the caption communicates the
// important information contained in the chart.

// ---------------------------------------------------------------------
// 27. Data should not exist only in a chart
// ---------------------------------------------------------------------

export const AccessibleChartData = (): ReactElement => {
  return (
    <section>
      <h2>Monthly sales</h2>

      <img src="/example-sales-chart.png" alt="Monthly sales chart" />

      <table>
        <caption>Monthly sales data</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Sales</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>January</td>
            <td>100</td>
          </tr>
          <tr>
            <td>February</td>
            <td>150</td>
          </tr>
          <tr>
            <td>March</td>
            <td>200</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

// When exact data matters, a text or tabular representation can provide
// information that a short image alternative cannot fully communicate.

// ---------------------------------------------------------------------
// 28. Decorative image with figure
// ---------------------------------------------------------------------

export const DecorativeFigure = (): ReactElement => {
  return (
    <figure>
      <img src="/example-decoration.png" alt="" />
      <figcaption>Example decorative illustration.</figcaption>
    </figure>
  );
};

// A figure caption can itself communicate information.
//
// Whether the image needs an alt value depends on whether the image adds
// information beyond the caption.

// ---------------------------------------------------------------------
// 29. Image with a meaningful caption
// ---------------------------------------------------------------------

export const CaptionedImage = (): ReactElement => {
  return (
    <figure>
      <img src="/example-building.jpg" alt="" />
      <figcaption>Example office building viewed from the main entrance.</figcaption>
    </figure>
  );
};

// If the caption provides the required alternative information, the image
// itself can be treated as decorative to avoid duplicate announcements.

// ---------------------------------------------------------------------
// 30. Image dimensions
// ---------------------------------------------------------------------

export const ImageDimensions = (): ReactElement => {
  return <img src="/example-product.jpg" alt="Example product" width={800} height={600} />;
};

// Providing intrinsic dimensions can help the browser reserve layout
// space before the image finishes loading.
//
// This is a layout consideration rather than an alternative-text
// mechanism.

// ---------------------------------------------------------------------
// 31. Lazy loading does not replace alt text
// ---------------------------------------------------------------------

export const LazyImage = (): ReactElement => {
  return <img src="/example-photo.jpg" alt="Example landscape" loading="lazy" />;
};

// loading="lazy" controls image loading behavior.
//
// It does not affect whether the image needs an appropriate text
// alternative.

// ---------------------------------------------------------------------
// 32. Decorative images and loading
// ---------------------------------------------------------------------

export const DecorativeLazyImage = (): ReactElement => {
  return <img src="/example-decoration.png" alt="" loading="lazy" />;
};

// A decorative image can still be lazy-loaded.
//
// Loading behavior and accessibility semantics are separate concerns.

// ---------------------------------------------------------------------
// 33. Responsive images
// ---------------------------------------------------------------------

export const ResponsiveImage = (): ReactElement => {
  return (
    <img
      src="/example-product.jpg"
      srcSet="/example-product-small.jpg 480w, /example-product-large.jpg 1200w"
      sizes="(max-width: 600px) 480px, 1200px"
      alt="Example product shown from the front"
    />
  );
};

// Responsive image selection changes which resource the browser loads.
//
// The alt attribute remains the same because the image's meaning has not
// changed.

// ---------------------------------------------------------------------
// 34. Picture element
// ---------------------------------------------------------------------

export const PictureExample = (): ReactElement => {
  return (
    <picture>
      <source media="(min-width: 800px)" srcSet="/example-landscape-large.jpg" />
      <source media="(max-width: 799px)" srcSet="/example-landscape-small.jpg" />
      <img src="/example-landscape-small.jpg" alt="Mountain lake surrounded by pine forest" />
    </picture>
  );
};

// The img element remains the fallback and semantic image element.
//
// The alternative text belongs on img, not on source.

// ---------------------------------------------------------------------
// 35. Image loading failure
// ---------------------------------------------------------------------

export const ImageWithFallbackText = (): ReactElement => {
  return (
    <figure>
      <img src="/example-product.jpg" alt="Example product shown from the front" />
      <figcaption>Example product.</figcaption>
    </figure>
  );
};

// A useful alt attribute remains meaningful if the image resource cannot
// be displayed.
//
// The surrounding text can also provide context when appropriate.

// ---------------------------------------------------------------------
// 36. Do not use alt text as a tooltip
// ---------------------------------------------------------------------

export const AltIsNotATooltip = (): ReactElement => {
  return <img src="/example-product.jpg" alt="Example product" title="View the example product" />;
};

// alt and title have different purposes.
//
// alt provides a text alternative for the image.
//
// title is not a replacement for alt and should not be used as the
// primary accessibility mechanism.

// ---------------------------------------------------------------------
// 37. Alt text is not a filename
// ---------------------------------------------------------------------

export const MeaningfulAltText = (): ReactElement => {
  return <img src="/assets/john-doe-profile-2026.jpg" alt="John Doe" />;
};

// The source filename is an implementation detail.
//
// Users should receive meaningful content rather than a generated
// filename.

// ---------------------------------------------------------------------
// 38. Do not use excessive punctuation
// ---------------------------------------------------------------------

export const CleanAltText = (): ReactElement => {
  return <img src="/example-logo.svg" alt="Example" />;
};

// Excessive punctuation, decorative symbols, or repeated characters can
// make alternative text unnecessarily difficult to consume.

// ---------------------------------------------------------------------
// 39. Decorative SVG
// ---------------------------------------------------------------------

export const DecorativeSvg = (): ReactElement => {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  );
};

// Inline SVG does not use the img alt attribute.
//
// When an SVG is purely decorative, it can be excluded from the
// accessibility tree with appropriate attributes.

// ---------------------------------------------------------------------
// 40. Meaningful inline SVG
// ---------------------------------------------------------------------

export const MeaningfulSvg = (): ReactElement => {
  return (
    <svg role="img" aria-labelledby="status-icon-title" viewBox="0 0 24 24">
      <title id="status-icon-title">Warning</title>
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  );
};

// Meaningful inline SVG needs an accessible name or alternative according
// to its role and implementation.
//
// SVG accessibility is separate from the alt attribute used by img.

// ---------------------------------------------------------------------
// 41. Icon-only link
// ---------------------------------------------------------------------

export const IconOnlyLink = (): ReactElement => {
  return (
    <a href="/example/search" aria-label="Search">
      <img src="/example-search.svg" alt="" />
    </a>
  );
};

// The link needs an accessible name.
//
// The decorative icon does not need to repeat that name.

// ---------------------------------------------------------------------
// 42. Icon-only button with an informative image
// ---------------------------------------------------------------------

export const InformativeIconButton = (): ReactElement => {
  return (
    <button type="button">
      <img src="/example-refresh.svg" alt="Refresh" />
    </button>
  );
};

// Here the image supplies the button's accessible name.
//
// No separate aria-label is required because the image already provides
// the relevant accessible text.

// ---------------------------------------------------------------------
// 43. Decorative image in a card
// ---------------------------------------------------------------------

export const DecorativeCardImage = (): ReactElement => {
  return (
    <article>
      <img src="/example-card-decoration.jpg" alt="" />

      <h2>Example article</h2>
      <p>Example article description.</p>
    </article>
  );
};

// If the image is purely decorative and the article's meaning is already
// communicated by its text, the image can be omitted from the accessibility
// tree through an empty alt value.

// ---------------------------------------------------------------------
// 44. Informative card image
// ---------------------------------------------------------------------

export const InformativeCardImage = (): ReactElement => {
  return (
    <article>
      <img src="/example-card-product.jpg" alt="Example product in a silver finish" />

      <h2>Example product</h2>
      <p>Available in multiple finishes.</p>
    </article>
  );
};

// The image contributes information that is not fully expressed by the
// surrounding text.

// ---------------------------------------------------------------------
// 45. Image maps and hotspots
// ---------------------------------------------------------------------

export const ImageMapExample = (): ReactElement => {
  return (
    <figure>
      <img src="/example-floor-plan.jpg" alt="Floor plan of the example office" useMap="#example-floor-plan" />

      <map name="example-floor-plan">
        <area shape="rect" coords="0,0,100,100" href="/example/office" alt="Office" />
      </map>
    </figure>
  );
};

// Interactive image regions need their own meaningful alternatives.
//
// The image and each interactive region communicate different information.

// ---------------------------------------------------------------------
// 46. Capturing the purpose of a thumbnail
// ---------------------------------------------------------------------

export const ThumbnailLink = (): ReactElement => {
  return (
    <a href="/example/photo">
      <img src="/example-thumbnail.jpg" alt="View the example landscape photograph" />
    </a>
  );
};

// When the image itself is the link content, the alternative should
// communicate the link's purpose or destination.

// ---------------------------------------------------------------------
// 47. Thumbnail beside a visible link
// ---------------------------------------------------------------------

export const ThumbnailWithTextLink = (): ReactElement => {
  return (
    <article>
      <img src="/example-thumbnail.jpg" alt="" />

      <a href="/example/photo">View the example landscape photograph</a>
    </article>
  );
};

// The visible link already communicates the destination.
//
// The thumbnail can therefore be decorative when it contributes no
// additional information.

// ---------------------------------------------------------------------
// 48. Product images
// ---------------------------------------------------------------------

export interface ProductImageProps {
  readonly productName: string;
  readonly imageDescription: string;
}

export const ProductImageExample = ({ productName, imageDescription }: ProductImageProps): ReactElement => {
  return (
    <figure>
      <img src="/example-product.jpg" alt={`${productName}: ${imageDescription}`} />
      <figcaption>{productName}</figcaption>
    </figure>
  );
};

// Product imagery can communicate appearance, color, configuration, or
// other information relevant to a purchasing decision.
//
// The alternative should focus on information users need for the task.

// ---------------------------------------------------------------------
// 49. User-generated images
// ---------------------------------------------------------------------

export interface UserGeneratedImageProps {
  readonly altText: string;
  readonly src: string;
}

export const UserGeneratedImage = ({ altText, src }: UserGeneratedImageProps): ReactElement => {
  return <img src={src} alt={altText} />;
};

// Applications displaying user-generated images may need an appropriate
// workflow for collecting or deriving alternative text.
//
// Do not silently replace meaningful user-provided descriptions with
// generic text such as "image".

// ---------------------------------------------------------------------
// 50. Missing user-generated alt text
// ---------------------------------------------------------------------

export interface ImageSubmission {
  readonly src: string;
  readonly altText: string;
}

export const imageSubmission: ImageSubmission = {
  src: "/example-upload.jpg",
  altText: "Example landscape near a lake",
};

// If users can supply alternative text, store it as content associated
// with the image.
//
// The application should distinguish meaningful empty alt text for
// decorative content from missing information for an informative image.

// ---------------------------------------------------------------------
// 51. Image galleries
// ---------------------------------------------------------------------

export const ImageGallery = (): ReactElement => {
  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Example gallery</h2>

      <ul>
        <li>
          <img src="/example-gallery-1.jpg" alt="Mountain lake surrounded by pine forest" />
        </li>
        <li>
          <img src="/example-gallery-2.jpg" alt="Example office building viewed from the entrance" />
        </li>
      </ul>
    </section>
  );
};

// Each informative image needs an alternative that distinguishes its
// meaningful content from the other images in the gallery.

// ---------------------------------------------------------------------
// 52. Repeated images
// ---------------------------------------------------------------------

export const RepeatedProductImage = (): ReactElement => {
  return (
    <article>
      <img src="/example-product.jpg" alt="" />

      <h2>Example product</h2>
      <p>Example product description.</p>
    </article>
  );
};

// If a repeated image adds no information beyond the product name and
// description, it can be decorative.

// ---------------------------------------------------------------------
// 53. Image-only information
// ---------------------------------------------------------------------

export const ImageOnlyInformation = (): ReactElement => {
  return (
    <section>
      <h2>Example status</h2>

      <img src="/example-status.svg" alt="Service unavailable" />
    </section>
  );
};

// If the image is the only source of important information, the
// alternative must communicate that information.

// ---------------------------------------------------------------------
// 54. Avoid generic alternatives
// ---------------------------------------------------------------------

export const GenericAltText = (): ReactElement => {
  return <img src="/example-product.jpg" alt="Image" />;
};

// "Image" tells the user almost nothing about the information conveyed.
//
// Generic alternatives should be replaced with meaningful text or an
// empty value when the image is decorative.

// ---------------------------------------------------------------------
// 55. Alt text should not repeat surrounding text unnecessarily
// ---------------------------------------------------------------------

export const NonRedundantAlt = (): ReactElement => {
  return (
    <article>
      <h2>Example product</h2>

      <img src="/example-product.jpg" alt="" />

      <p>Example product with a silver finish and adjustable controls.</p>
    </article>
  );
};

// If surrounding text already communicates everything important about the
// image, repeating it in alt text can create unnecessary duplication.

// ---------------------------------------------------------------------
// 56. Image and caption with different information
// ---------------------------------------------------------------------

export const DistinctImageAndCaption = (): ReactElement => {
  return (
    <figure>
      <img src="/example-building.jpg" alt="Example office building with three visible floors" />
      <figcaption>The building opened in 2026.</figcaption>
    </figure>
  );
};

// The alt text describes information communicated by the image.
//
// The caption provides related information that is not necessarily visible
// in the image.

// ---------------------------------------------------------------------
// 57. Alt text and localization
// ---------------------------------------------------------------------

export interface LocalizedImageProps {
  readonly alt: string;
  readonly src: string;
}

export const LocalizedImage = ({ alt, src }: LocalizedImageProps): ReactElement => {
  return <img src={src} alt={alt} />;
};

// Alternative text is user-facing content and should be localized when
// the surrounding application supports multiple languages.

// ---------------------------------------------------------------------
// 58. Accessibility testing of images
// ---------------------------------------------------------------------

export const imageAccessibilityChecks = [
  "Every informative img has an appropriate alt value.",
  'Decorative img elements use alt="".',
  "Image links communicate their destination or purpose.",
  "Icon-only controls have accessible names.",
  "Complex images have an appropriate longer alternative.",
  "Important image information is not available only through CSS.",
  "Meaningful SVG graphics have accessible semantics.",
  "Redundant images do not unnecessarily repeat nearby information.",
] as const;

// Testing should evaluate whether the alternative communicates the correct
// information, not merely whether an alt attribute exists.

// ---------------------------------------------------------------------
// 59. Common alt-text mistakes
// ---------------------------------------------------------------------

export const commonAltTextMistakes = [
  "Omitting alt from an informative image",
  "Using a filename as alt text",
  'Using "image" or "photo" without useful context',
  "Repeating nearby text unnecessarily",
  "Describing irrelevant visual details",
  "Writing extremely long alternatives for simple images",
  "Putting essential information only in a CSS background image",
  "Using alt as a tooltip",
] as const;

// An alt attribute can exist and still provide a poor accessibility
// experience.
//
// Quality depends on whether the alternative serves the same relevant
// purpose as the image.

// ---------------------------------------------------------------------
// 60. Integrated image example
// ---------------------------------------------------------------------

export const AccessibleImageExample = (): ReactElement => {
  return (
    <main>
      <h1>Example product</h1>

      <figure>
        <img
          src="/example-product.jpg"
          alt="Example product with a silver control panel and black exterior"
          width={800}
          height={600}
        />
        <figcaption>Example product shown from the front.</figcaption>
      </figure>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading">Features</h2>

        <ul>
          <li>Adjustable controls</li>
          <li>Silver control panel</li>
          <li>Black exterior</li>
        </ul>
      </section>

      <section aria-labelledby="gallery-heading">
        <h2 id="gallery-heading">Gallery</h2>

        <ul>
          <li>
            <img src="/example-detail.jpg" alt="Close-up of the example product control panel" />
          </li>
          <li>
            <img src="/example-decoration.jpg" alt="" />
          </li>
        </ul>
      </section>

      <a href="/example/products">
        <img src="/example-back.svg" alt="" />
        Back to products
      </a>
    </main>
  );
};

// This example demonstrates several distinct decisions:
//
// - informative product image
// - figure and figcaption
// - meaningful gallery alternatives
// - decorative gallery image
// - decorative icon beside visible link text
//
// Each image is evaluated according to its role rather than by applying
// one generic alt-text rule to every image.

// ---------------------------------------------------------------------
// 61. Image accessibility decision process
// ---------------------------------------------------------------------

export const imageDecisionProcess = [
  "Determine why the image exists.",
  "Ask whether the image communicates information.",
  "Ask whether nearby text already communicates that information.",
  "Ask whether the image performs a function.",
  "Choose an appropriate text alternative when information is needed.",
  'Use alt="" when the image is intentionally decorative.',
  "Provide additional content for complex images when a short alternative is insufficient.",
  "Test the result with assistive technology when appropriate.",
] as const;

// The central question is not:
//
// "What does this image look like?"
//
// The more useful question is:
//
// "What information or function does this image provide in this context?"

// ---------------------------------------------------------------------
// 62. Final image accessibility model
// ---------------------------------------------------------------------

export interface ImageAccessibilityModel {
  readonly purposeIdentified: boolean;
  readonly informativeImagesHaveAlternatives: boolean;
  readonly decorativeImagesAreIgnored: boolean;
  readonly functionalImagesCommunicatePurpose: boolean;
  readonly complexImagesHaveAdditionalInformation: boolean;
  readonly importantInformationIsNotImageOnly: boolean;
}

export const imageAccessibilityModel: ImageAccessibilityModel = {
  purposeIdentified: true,
  informativeImagesHaveAlternatives: true,
  decorativeImagesAreIgnored: true,
  functionalImagesCommunicatePurpose: true,
  complexImagesHaveAdditionalInformation: true,
  importantInformationIsNotImageOnly: true,
};

// Accessible images are not produced by writing the same kind of
// description for every image.
//
// The implementation should preserve the image's relevant information
// and function for users who cannot perceive it visually.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The alt attribute provides a text alternative for an img element when an alternative is needed.
// - The correct alternative depends on the image's purpose and surrounding context.
// - Informative images should have concise alt text that communicates their relevant information.
// - Decorative images should generally use alt="" so assistive technologies can ignore them.
// - An empty alt value is different from omitting the alt attribute.
// - Alt text should communicate purpose rather than filenames, URLs, or irrelevant visual details.
// - "Image of" and "photo of" are usually unnecessary when the image role is already communicated by the browser.
// - Functional images should communicate the purpose or destination of the control containing them.
// - An icon inside a button or link can be decorative when the surrounding control already has an accessible name.
// - If visible text already communicates an image's information, the image can often be decorative to avoid duplication.
// - Logos should be given meaningful alternatives when they communicate the identity or purpose of a link or image.
// - Important text should generally be real HTML text rather than text embedded only inside an image.
// - Complex images such as charts and diagrams may require additional text or tabular information beyond a short alt attribute.
// - Essential information should not be communicated only through a CSS background image.
// - loading="lazy" and responsive image techniques affect image loading, not the need for alternative text.
// - Inline SVG uses different accessibility mechanisms from img and does not use an alt attribute.
// - Meaningful inline SVG needs appropriate accessible semantics and an accessible name when applicable.
// - Alt text is not a tooltip and title should not be used as a replacement for alt.
// - User-generated images may require a workflow for collecting meaningful alternative text.
// - Repeated or redundant images can often use alt="" when nearby text already provides the same information.
// - Image accessibility testing should evaluate whether the alternative communicates the correct information, not merely whether an alt attribute exists.
// - The central image-accessibility question is what information or function the image provides in its context, not simply what the image looks like.
