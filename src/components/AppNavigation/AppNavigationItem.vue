<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->
<template>

	<!-- Is this a caption ? -->
	<li v-if="item.caption" class="app-navigation-caption">{{ item.text }}</li>

	<!-- Navigation item -->
	<nav-element v-else :id="item.id" v-bind="navElement(item)"
		:title="item.title" :class="[{'icon-loading-small': item.loading, 'open': item.opened, 'collapsible': item.collapsible&&item.children&&item.children.length>0 }, item.classes]">

		<!-- Bullet -->
		<div v-if="item.bullet" :style="{ backgroundColor: item.bullet }" class="app-navigation-entry-bullet" />

		<!-- Is this a simple action ? -->
		<a v-if="item.action" :class="item.icon" href="#"
			@click.prevent.stop="item.action">
			<img v-if="item.iconUrl" :alt="item.text" :src="item.iconUrl">
			{{ item.text }}
		</a>

		<!-- Main link -->
		<a v-else :href="(item.href) ? item.href : '#' " :class="item.icon"
			@click="toggleCollapse">
			<img v-if="item.iconUrl" :alt="item.text" :src="item.iconUrl">
			{{ item.text }}
		</a>

		<!-- Popover, counter and button(s) -->
		<div v-if="item.utils" class="app-navigation-entry-utils">
			<ul>
				<!-- counter -->
				<li v-if="Number.isInteger(item.utils.counter) && item.utils.counter > 0"
					class="app-navigation-entry-utils-counter">
					{{ item.utils.counter }}
				</li>

				<!-- first action if only one action -->
				<li v-if="item.utils.actions && item.utils.actions.length === 1"
					class="app-navigation-entry-utils-menu-button">
					<button :class="item.utils.actions[0].icon" :title="item.utils.actions[0].text" @click="item.utils.actions[0].action" />
				</li>

				<!-- second action only two actions and no counter -->
				<li v-for="action in item.utils.actions"
					v-else-if="item.utils.actions && item.utils.actions.length === 2 && !Number.isInteger(item.utils.counter)" :key="action.action"
					class="app-navigation-entry-utils-menu-button">
					<button :class="action.icon" :title="action.text" @click="action.action" />
				</li>

				<!-- menu if only at least one action and counter OR two actions and no counter-->
				<li v-else-if="item.utils.actions && item.utils.actions.length > 1 && (Number.isInteger(item.utils.counter) || item.utils.actions.length > 2)"
					class="app-navigation-entry-utils-menu-button">
					<button v-click-outside="hideMenu" @click="showMenu" />
				</li>
			</ul>
		</div>

		<!-- if more than 2 actions or more than 1 actions with counter -->
		<div v-if="item.utils && item.utils.actions && item.utils.actions.length > 1 && (Number.isInteger(item.utils.counter) || item.utils.actions.length > 2)"
			:class="{ 'open': openedMenu }" class="app-navigation-entry-menu">
			<popover-menu :menu="item.utils.actions" />
		</div>

		<!-- undo entry -->
		<div v-if="item.undo" class="app-navigation-entry-deleted">
			<div class="app-navigation-entry-deleted-description">{{ item.undo.text }}</div>
			<button :title="t('settings', 'Undo')" class="app-navigation-entry-deleted-button icon-history" />
		</div>

		<!-- edit entry -->
		<div v-if="item.edit" class="app-navigation-entry-edit">
			<form @submit.prevent.stop="item.edit.action">
				<input :placeholder="item.edit.text" type="text">
				<input type="submit" value="" class="icon-confirm">
				<input type="submit" value="" class="icon-close"
					@click.stop.prevent="cancelEdit">
			</form>
		</div>

		<!-- if the item has children, inject the component with proper data -->
		<ul v-if="item.children">
			<navigation-item v-for="(child, key) in item.children" :key="key" :item="child" />
		</ul>
	</nav-element>
</template>

<script>
import { PopoverMenu } from 'Components/PopoverMenu'
import ClickOutside from 'vue-click-outside'
import Vue from 'vue'

export default {
	name: 'AppNavigationItem',
	components: {
		PopoverMenu
	},
	directives: {
		ClickOutside
	},
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			openedMenu: false
		}
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},
	methods: {
		showMenu() {
			this.openedMenu = true
		},
		hideMenu() {
			this.openedMenu = false
		},
		toggleCollapse() {
			// if item.opened isn't set, Vue won't trigger view updates https://vuejs.org/v2/api/#Vue-set
			// ternary is here to detect the undefined state of item.opened
			Vue.set(this.item, 'opened', this.item.opened ? !this.item.opened : true)
		},
		cancelEdit(e) {
			// remove the editing class
			if (Array.isArray(this.item.classes)) {
				this.item.classes = this.item.classes.filter(item => item !== 'editing')
			}
			this.item.edit.reset(e)
		},
		// This is used to decide which outter element type to use
		// li or router-link
		navElement(item) {
			if (item.router) {
				let exact = item.router.exact
				if (typeof item.router.exact === 'undefined') {
					exact = true
				}

				return {
					is: 'router-link',
					tag: 'li',
					to: item.router,
					exact
				}
			}
			return {
				is: 'li'
			}
		}
	}
}
</script>
