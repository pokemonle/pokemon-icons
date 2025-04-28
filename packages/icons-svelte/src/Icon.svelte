<script lang="ts">
import type { IconProps } from "./types";

const { color, size, iconNode, children, ...rest }: IconProps = $props();
</script>

<svg width={size} height={size} {...rest}>
  {#each iconNode as [tag, attrs]}
    <svelte:element this={tag} {...attrs} />
  {/each}
  {#if children}
    {@render children()}
  {/if}
</svg>
