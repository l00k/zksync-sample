<script lang="ts">
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';


@Route('/', 'index')
@Component()
export default class IndexPage
    extends BaseComponent
{

    public async mounted ()
    {
    }

}
</script>
