<template>
    <div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    async created() {
        await this.cleanVotes();
        this.$router.push("/");
    },
    methods: {
        ...mapActions(["cleanVotes"])
    }
}
</script>