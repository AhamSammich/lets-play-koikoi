<script setup lang="ts">
defineProps<{
    styleName?: string;
}>();
</script>

<template>
    <div id="card-sheet" class="grid overflow-y-scroll">
        <Card v-for="cardName in CARDS" :key="cardName" :name="cardName" :forced-style="styleName" />
    </div>
</template>

<style scoped lang="postcss">
#card-sheet {
    --card-width: 100px;
    --row-size: 4;
    grid-template-columns: repeat(var(--row-size), minmax(0, 1fr));
    height: clamp(150px, 90vh, 700px);
}

@media (orientation: landscape) and (width > 768px) {
    #card-sheet {
        --card-width: 90px;
        --row-size: 8;
    }
}
</style>