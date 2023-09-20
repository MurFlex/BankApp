import ChildComponent from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'
import { Store } from '@/core/store/store'

import { Heading } from '@/components/ui/heading/heading.component'
import {
	LOADER_SELECTOR,
	Loader
} from '@/components/ui/loader/loader.component'

import { formatToCurrency } from '@/utils/format/format-to-currency'

import { StatisticService } from '@/api/statistic.service'

import styles from './statistics.module.scss'
import template from './statistics.template.html'

import { CircleChart } from './circle-chart/circle-chart.component'
import { StatisticsItem } from './statistics-item/statistics-item.component'
import { TRANSACTION_COMPLETED } from '@/constants/event.constants'

export class Statistics extends ChildComponent {
	constructor() {
		super()

		this.store = Store.getInstance().state
		this.statisticsService = new StatisticService()

		this.#addListeners()
	}

	#addListeners() {
		document.addEventListener(
			TRANSACTION_COMPLETED,
			this.#onTransactionCompleted
		)
	}

	#removeListeners() {
		document.removeEventListener(
			TRANSACTION_COMPLETED,
			this.#onTransactionCompleted
		)
	}

	#onTransactionCompleted = () => {
		this.fetchData()
	}

	destroy() {
		this.#removeListeners()
	}

	renderChart(income, expense) {
		const total = income + expense
		let incomePercent = (income * 100) / total
		let expensePercent = 100 - incomePercent

		if (income && !expense) {
			incomePercent = 100
			expensePercent = 0.1
		}

		if (!income && expense) {
			incomePercent = 0.1
			expensePercent = 100
		}

		return new CircleChart(incomePercent, expensePercent).render()
	}

	fetchData() {
		this.statisticsService.main(data => {
			if (!data) return

			const loaderElement = this.element.querySelector(LOADER_SELECTOR)

			if (loaderElement) loaderElement.remove()

			const statisticsItemsElement = $R(this.element).find('#statistics-items')
			statisticsItemsElement.text('')

			const circleChartElement = $R(this.element).find('#circle-chart')
			circleChartElement.text('')

			statisticsItemsElement
				.append(
					new StatisticsItem(
						'Income',
						formatToCurrency(data[0].value),
						'green'
					).render()
				)
				.append(
					new StatisticsItem(
						'Expense',
						formatToCurrency(data[1].value),
						'purple'
					).render()
				)

			circleChartElement.append(this.renderChart(data[0].value, data[1].value))
		})
	}

	render() {
		this.element = renderService.htmlToElement(
			template,
			[new Heading('Statistics')],
			styles
		)

		if (this.store.user) {
			$R(this.element).append(new Loader().render())
			setTimeout(() => this.fetchData(), 1500)
		}

		return this.element
	}
}
