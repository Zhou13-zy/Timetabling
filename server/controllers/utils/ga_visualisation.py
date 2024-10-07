from os import makedirs
import random
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator
import numpy as np
import pandas as pd
import seaborn as sns
from typing import Any

from models.venue import Venue
from models.generation import Generation, PopulationSession
from controllers.utils.timetabling_functions_ga import (
    DAY_START_HOUR,
    DAY_END_HOUR,
    DAYS_OF_WEEK,
    TOTAL_HOURS_IN_DAY,
    TOTAL_HOURS_IN_WEEK
)


IMG_ROOT_FOLDER = "images"


def visualize_sessions_across_venues(
    venues: list[Venue],
    timetable_by_venues_by_timeslots: list[list[list[PopulationSession]]]
):
    # Data for venues and the number of classes per timeslot
    venue_labels = [v.name for v in venues]
    timeslots = np.array([
        [len(y) for y in x]
        for x in timetable_by_venues_by_timeslots
    ]) # Counts of sessions where row = venue indices and columns = timeslot indices(e.g. 0,1,2,...,65,...)
    timeslots = timeslots.transpose() # Transposing, because we need timeslot as rows and venues as columns

    # Stacked bar chart
    fig, ax = plt.subplots(figsize=(10, 10))

    # Bar width
    bar_width = 0.6

    # Generate the stacked bar positions
    indices = np.arange(len(venue_labels))
    colors = np.random.rand(len(timeslots),3).tolist()

    # Plot each timeslot as a stack on top of the previous one
    bottom = None
    for i, t in enumerate(timeslots):
        ax.bar(
            x=indices,
            height=t,
            width=bar_width,
            bottom = bottom if (bottom is not None) else np.array([0] * len(venues)),
            label=f'Timeslot {i + 1}',
            color=colors[i]
        )
        if bottom is None:
            bottom = np.array(t)
        else:
            bottom += np.array(t)

    # Add labels, title, and legend
    ax.set_xlabel('Venues', fontsize=14)
    ax.set_ylabel('Number of Classes', fontsize=14)
    ax.set_title('Classes Scheduled in Different Timeslots Across Venues', fontsize=16)
    ax.set_xticks(indices)
    ax.set_xticklabels(venue_labels)
    ax.tick_params(axis='x', labelrotation=90)
    ax.grid(axis='y')
    ax.yaxis.set_major_locator(MaxNLocator(integer=True))

    # Display the legend
    ax.legend()
    plt.legend(bbox_to_anchor=(1.04, 0.5), loc="center left")

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/1_sessions_across_venues.png', bbox_inches='tight')


def visualize_sessions_across_timeslots(
    venues: list[Venue],
    timetable_by_venues_by_timeslots: list[list[list[PopulationSession]]]
):
    # Data for venues and the number of classes per timeslot
    venue_labels = [v.name for v in venues]
    timeslots = np.array([
        [len(y) for y in x]
        for x in timetable_by_venues_by_timeslots
    ]) # Counts of sessions where row = venue indices and columns = timeslot indices(e.g. 0,1,2,...,65,...)
    timeslot_labels = [f'TS {i+1}' for i in range(len(timeslots[0]))]

    # Create the heatmap using seaborn
    plt.figure(figsize=(18, 8))
    sns.heatmap(timeslots, annot=True, cmap="YlGnBu", xticklabels=timeslot_labels, yticklabels=venue_labels)

    # Add labels and title
    plt.title('Number of Classes Scheduled for Each Venue Across Timeslots', fontsize=16)
    plt.xlabel('Timeslots', fontsize=14)
    plt.ylabel('Venues', fontsize=14)

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/2_sessions_across_timeslots.png', bbox_inches='tight')


def visualize_sessions_freq_by_day_hour(
    venues: list[Venue],
    timetable_by_venues_by_timeslots: list[list[list[PopulationSession]]]
):
    timeslots = np.array([
        [len(y) for y in x]
        for x in timetable_by_venues_by_timeslots
    ]) # Counts of sessions where row = venue indices and columns = timeslot indices(e.g. 0,1,2,...,65,...)
    counts_by_timeslots = timeslots.sum(axis=0) # Sum by columns (columns are the timeslot indices in that array)

    data = {
        'Day': [
            day.title()
            for day in DAYS_OF_WEEK
            for _ in range(TOTAL_HOURS_IN_DAY)
        ],
        'TimeSlot': [
            f'{hour:>02}:00-{hour + 1:>02}:00'
            for _ in DAYS_OF_WEEK
            for hour in range(DAY_START_HOUR, DAY_START_HOUR + TOTAL_HOURS_IN_DAY)
        ],
        'ClassCount': counts_by_timeslots
    }
    df = pd.DataFrame(data)

    # Pivot the DataFrame for the heatmap
    heatmap_data = df.pivot(index='Day', columns='TimeSlot', values='ClassCount')

    # Create heatmap
    plt.figure(figsize=(10, 6))
    sns.heatmap(heatmap_data, annot=True, cmap="YlGnBu", linewidths=.5)
    plt.title('Class Frequency by Day and Time Slot')

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/3_sessions_freq_by_day_hour.png', bbox_inches='tight')


def visualize_hyperparam_tuning_impact(
    population_sizes: list[int],
    # all_graph_data: list[dict[str, Any]]
    average_fitness_scores: list[float]
):
    # Bar Chart
    plt.figure(figsize=(8, 5))
    plt.bar(population_sizes, average_fitness_scores, color='skyblue')
    plt.title('Impact of Population Size on Average Fitness Score')
    plt.xlabel('Population Size')
    plt.ylabel('Average Fitness Score')
    plt.xticks(population_sizes)
    plt.grid(axis='y')

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/4_hyperparam_tuning_impact.png', bbox_inches='tight')


# def visualize_fitness_landscape():
#     # Sample data for fitness landscape
#     x = np.linspace(0, 1, 100)
#     y = np.linspace(0, 1, 100)
#     X, Y = np.meshgrid(x, y)
#     Z = np.sin(X * 10) * np.cos(Y * 10)  # Example fitness function

#     # Contour Plot
#     plt.figure(figsize=(10, 6))
#     contour = plt.contourf(X, Y, Z, levels=50, cmap='viridis')
#     plt.colorbar(contour)
#     plt.title('Fitness Landscape')
#     plt.xlabel('Crossover Rate')
#     plt.ylabel('Mutation Rate')
#     plt.grid()
#     plt.show()


def visualize_constraint_satisfaction(all_generations: list[Generation]):
    # Sample data for constraint satisfaction
    constraints_label = ['Equipment', 'Blocked Timeslots',
        'Staff Assignment', 'Venue Assignment', 'Clashing Unit']

    equipments_violation_count: list[int] = []
    blocked_timeslot_violation_count: list[int] = []
    staff_violation_count: list[int] = []
    venue_violation_count: list[int] = []
    clashing_unit_violation_count: list[int] = []

    for g in all_generations:
        best_population = g.populations[0]
        equipments_violation_count.append(best_population.fitness.equipments_conflict_count)
        blocked_timeslot_violation_count.append(best_population.fitness.blocked_timeslot_conflict_count)
        staff_violation_count.append(best_population.fitness.same_staff_conflict_count)
        venue_violation_count.append(best_population.fitness.same_venue_conflict_count)
        clashing_unit_violation_count.append(best_population.fitness.clashing_unit_conflict_count)

    violations = np.array([
        equipments_violation_count,
        blocked_timeslot_violation_count,
        staff_violation_count,
        venue_violation_count,
        clashing_unit_violation_count
    ]) # Counts of sessions where row = violation indices and columns = generation indices

    # Stacked bar chart
    fig, ax = plt.subplots(figsize=(10, 10))

    # Bar width
    bar_width = 0.6

    # Generate the stacked bar positions
    indices = np.arange(len(all_generations))
    colors = np.random.rand(len(violations),3).tolist()

    # Plot each timeslot as a stack on top of the previous one
    bottom = None
    for i, v in enumerate(violations):
        ax.bar(
            x=indices,
            height=v,
            width=bar_width,
            bottom = bottom if (bottom is not None) else np.array([0] * len(all_generations)),
            label=constraints_label[i],
            color=colors[i]
        )
        if bottom is None:
            bottom = np.array(v)
        else:
            bottom += np.array(v)

    # Add labels, title, and legend
    ax.set_xlabel('Populations', fontsize=14)
    ax.set_ylabel('Number of Violations', fontsize=14)
    ax.set_title('Constraint Satisfaction', fontsize=16)
    ax.set_xticks(indices)
    ax.set_xticklabels([f'Run {i + 1}' for i in range(len(all_generations))])
    ax.tick_params(axis='x', labelrotation=90)
    ax.grid(axis='y')
    ax.yaxis.set_major_locator(MaxNLocator(integer=True))

    # Display the legend
    ax.legend()
    plt.legend(bbox_to_anchor=(1.04, 0.5), loc="center left")

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/6_constraints_satisfaction.png', bbox_inches='tight')


def visualize_num_of_generations(multiple_runs_data: dict[str, Any]):
    all_generations_in_all_runs: list[list[Generation]] = [d["all_generations"] for d in multiple_runs_data.values()]
    pop_size_in_all_runs: list[int] = [d["max_population_count"] for d in multiple_runs_data.values()]

    indices = range(len(all_generations_in_all_runs))
    num_generations = np.array([len(r) for r in all_generations_in_all_runs])

    # Line Chart
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(indices, num_generations, marker='o')
    ax.set_title('Number of Generations to Reach Convergence', fontsize=16)
    ax.set_xlabel('Runs', fontsize=14)
    ax.set_ylabel('Generations', fontsize=14)
    ax.grid()
    ax.set_xticks(indices)
    ax.set_xticklabels([f'Population Size = {size}' for size in pop_size_in_all_runs])
    ax.set_ylim(ymin=0)
    ax.tick_params(axis='x', labelrotation=90)

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/7_num_of_generations.png', bbox_inches='tight')


def visualize_convergence_rate(multiple_runs_data: dict[str, Any]):
    all_generations_in_all_runs: list[list[Generation]] = [d["all_generations"] for d in multiple_runs_data.values()]
    pop_size_in_all_runs: list[int] = [d["max_population_count"] for d in multiple_runs_data.values()]

    fig, ax = plt.subplots(figsize=(10, 6))

    for run_idx, run in enumerate(multiple_runs_data.values()):
        all_gens: list[Generation] = run["all_generations"]
        max_pop_count: int = run["max_population_count"]
        ax.plot(
            [(i + 1) for i in range(len(all_gens))],
            [g.populations[0].fitness.score for g in all_gens],
            label=f'Run {run_idx + 1} (pop size = {pop_size_in_all_runs[run_idx]})'
        )
        for g in all_gens:
            best_population = g.populations[0]

    ax.set_title('Convergence Rate', fontsize=16)
    ax.set_xlabel('Generations', fontsize=14)
    ax.set_ylabel('Fitness Score', fontsize=14)
    ax.grid()

    # Display the legend
    ax.legend()
    plt.legend(bbox_to_anchor=(1.04, 0.5), loc="center left")

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/8_convergence_rate.png', bbox_inches='tight')


def visualize_solution_quality(multiple_runs_data: dict[str, Any]):
    all_generations_in_all_runs: list[list[Generation]] = [d["all_generations"] for d in multiple_runs_data.values()]
    pop_size_in_all_runs: list[int] = [d["max_population_count"] for d in multiple_runs_data.values()]
    fitness_scores = [
        [
            g.populations[0].fitness.score
            for g in d["all_generations"]
        ]
        for d in multiple_runs_data.values()
    ]

    # Histogram
    colors = np.random.rand(len(fitness_scores),3).tolist()
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.hist(
        fitness_scores,
        bins=10,
        color=colors,
        edgecolor='black',
        label=[f'Run {i + 1} (pop size = {pop_size_in_all_runs[i]})' for i in range(len(pop_size_in_all_runs))]
    )
    ax.set_title('Distribution of Final Solutions', fontsize=16)
    ax.set_xlabel('Fitness Score', fontsize=14)
    ax.set_ylabel('Frequency', fontsize=14)
    ax.grid(axis='y')

    # Display the legend
    ax.legend()
    plt.legend(bbox_to_anchor=(1.04, 0.5), loc="center left")

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/9_solution_quality.png', bbox_inches='tight')


def visualize_diversity_of_solutions(
    all_generations: list[Generation],
    population_size: int
):
    indices = np.arange(population_size)
    fitness_scores = [
        [
            p.fitness.score
            for p in g.populations
        ] for g in all_generations
    ]

    colors = np.random.rand(len(all_generations),3).tolist()
    fig, ax = plt.subplots(figsize=(10, 6))

    # Scatter plot
    for i, fitnesses_of_gen in enumerate(fitness_scores):
        ax.scatter(
            x=indices,
            y=fitness_scores[i],
            label=f'Population {i + 1}',
            color=colors[i]
        )

    ax.set_title('Diversity of Solutions Across Generations', fontsize=16)
    ax.set_xlabel(f'Generation (Population size = {population_size})', fontsize=14)
    ax.set_ylabel('Diversity Score', fontsize=14)
    ax.grid(axis='y')

    # Display the legend
    ax.legend()
    plt.legend(bbox_to_anchor=(1.04, 0.5), loc="center left")

    # Save the plot
    makedirs(IMG_ROOT_FOLDER, exist_ok=True)
    plt.savefig(f'{IMG_ROOT_FOLDER}/10_solution_diversity.png', bbox_inches='tight')
