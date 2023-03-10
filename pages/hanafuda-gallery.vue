<template>
    <article class="grid overflow-y-scroll text-white p-4">
        <section class="min-h-1/4 w-full grid gap-2 grid-cols-2 grid-rows-2 px-8 mb-4">
            <h2>Title</h2>
            <p>Description</p>
            <p>Link</p>
        </section>
        <section class="w-full h-full flex justify-center">
            <GalleryCardSheet style-name="nobori-blue"/>
        </section>
    </article>
</template>

<style scoped lang="postcss">
body {
    background-color: gray;
}
</style>